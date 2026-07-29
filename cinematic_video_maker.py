import PIL.Image
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = getattr(PIL.Image, 'Resampling', PIL.Image).LANCZOS

import os
import argparse
import random
import numpy as np
from moviepy.editor import ImageClip, CompositeVideoClip, AudioFileClip, ColorClip

def cinematic_color_grade(get_frame, t):
    """ Apply a slight contrast and color boost for a cinematic look """
    frame = get_frame(t)
    # Increase contrast by stretching pixel values slightly
    frame = np.clip((frame - 128) * 1.1 + 128, 0, 255).astype(np.uint8)
    return frame

def get_pan_zoom_effect(effect_type, t, duration, speed):
    """ Returns scale, x_offset, and y_offset based on time to simulate camera movement """
    scale = 1 + (speed * (t / duration))
    
    if effect_type == 'zoom_in_center':
        return scale, 'center', 'center'
    elif effect_type == 'zoom_out_center':
        scale = (1 + speed) - (speed * (t / duration))
        return scale, 'center', 'center'
    elif effect_type == 'pan_right':
        # Zoomed in slightly, moving from left to right
        x_pos = (t / duration)  # 0.0 to 1.0
        return 1 + (speed/2), x_pos, 'center'
    elif effect_type == 'pan_left':
        x_pos = 1.0 - (t / duration)
        return 1 + (speed/2), x_pos, 'center'
    elif effect_type == 'pan_up':
        y_pos = 1.0 - (t / duration)
        return 1 + (speed/2), 'center', y_pos
    elif effect_type == 'pan_down':
        y_pos = (t / duration)
        return 1 + (speed/2), 'center', y_pos

def create_cinematic_video(image_folder, music_file, output_path, resolution, fps, clip_duration, transition_duration, zoom_speed, selected_photos):
    print(f"Scanning folder: {image_folder}")
    valid_extensions = ('.png', '.jpg', '.jpeg')
    
    if selected_photos:
        images = [f.strip() for f in selected_photos.split(',')]
        images = [f for f in images if os.path.exists(os.path.join(image_folder, f))]
    else:
        images = [f for f in os.listdir(image_folder) if f.lower().endswith(valid_extensions)]
    
    if not images:
        print("Error: No valid images found to process.")
        return

    images.sort()
    clips = []
    target_width, target_height = resolution
    
    # Cinematic 21:9 Aspect Ratio calculation for Letterboxing
    # For a 1920x1080 video, 21:9 is roughly 1920x816. The rest will be black bars.
    cinematic_height = int(target_width / 2.35)
    bar_height = (target_height - cinematic_height) // 2

    effect_types = ['zoom_in_center', 'pan_right', 'zoom_out_center', 'pan_left', 'pan_up', 'pan_down']
    
    for idx, img_name in enumerate(images):
        img_path = os.path.join(image_folder, img_name)
        try:
            clip = ImageClip(img_path).set_duration(clip_duration)
            
            # 1. Resize to fit the height of our CINEMATIC crop
            clip = clip.resize(height=cinematic_height)
            if clip.w < target_width:
                clip = clip.resize(width=target_width)
            
            # Crop to the exact ultra-wide cinematic ratio
            clip = clip.crop(x_center=clip.w/2, y_center=clip.h/2, width=target_width, height=cinematic_height)
            
            # 2. Apply Cinematic Color Grading (Contrast Boost)
            clip = clip.fl(cinematic_color_grade)
            
            # 3. Apply Advanced Camera Movements (Pan & Zoom)
            effect = effect_types[idx % len(effect_types)]
            
            def make_frame(t, c=clip, eff=effect, dur=clip_duration, spd=zoom_speed, tw=target_width, th=cinematic_height):
                scale, x_align, y_align = get_pan_zoom_effect(eff, t, dur, spd)
                
                # We use PIL to resize the frame manually for panning because MoviePy's position/resize combo is hard to animate cleanly
                frame = c.get_frame(t)
                img = PIL.Image.fromarray(frame)
                
                new_w, new_h = int(tw * scale), int(th * scale)
                img = img.resize((new_w, new_h), PIL.Image.LANCZOS)
                
                # Calculate Crop Box based on alignment
                left = 0 if x_align == 'left' else (new_w - tw) if x_align == 'right' else (new_w - tw) // 2
                top = 0 if y_align == 'top' else (new_h - th) if y_align == 'bottom' else (new_h - th) // 2
                
                if isinstance(x_align, float):
                    left = int((new_w - tw) * x_align)
                if isinstance(y_align, float):
                    top = int((new_h - th) * y_align)
                    
                img = img.crop((left, top, left + tw, top + th))
                return np.array(img)
                
            # Create a new clip from the processed frames
            from moviepy.video.VideoClip import VideoClip
            animated_clip = VideoClip(make_frame, duration=clip_duration)
            
            clips.append(animated_clip)
            print(f"Processed image {idx + 1}/{len(images)}: {img_name} with {effect}")
            
        except Exception as e:
            print(f"Skipping {img_name} due to error: {e}")
            
    if not clips:
        return

    print("\nStitching clips together with smooth crossfades...")
    video_clips = [clips[0]]
    current_start_time = clip_duration - transition_duration
    
    for clip in clips[1:]:
        transition_clip = clip.set_start(current_start_time).crossfadein(transition_duration)
        video_clips.append(transition_clip)
        current_start_time += (clip_duration - transition_duration)
        
    main_video = CompositeVideoClip(video_clips, size=(target_width, cinematic_height))
    
    # 4. Add Cinematic Black Bars (Letterboxing) to make it standard 16:9 HD/4K
    final_video = CompositeVideoClip([main_video.set_position(('center', 'center'))], size=resolution)
    
    # Add background music
    if music_file and os.path.exists(music_file):
        try:
            audio = AudioFileClip(music_file)
            if audio.duration < final_video.duration:
                import moviepy.audio.fx.all as afx
                audio = afx.audio_loop(audio, duration=final_video.duration)
            else:
                audio = audio.subclip(0, final_video.duration)
                
            import moviepy.audio.fx.all as afx
            audio = audio.fx(afx.audio_fadeout, duration=3.0)
            final_video = final_video.set_audio(audio)
        except Exception as e:
            print(f"Failed to add audio: {e}")

    print(f"\nStarting high-end video render to {output_path}...")
    final_video.write_videofile(output_path, fps=fps, codec="libx264", audio_codec="aac", preset="fast", threads=4)
    print(f"\nSUCCESS! Video saved to: {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create a cinematic video from a folder of photos.")
    parser.add_argument("--photos", type=str, required=True, help="Path to the folder containing photos.")
    parser.add_argument("--music", type=str, required=False, default=None, help="Path to background music file (.mp3, .wav).")
    parser.add_argument("--output", type=str, required=False, default="cinematic_output.mp4", help="Output video file name.")
    parser.add_argument("--resolution", type=str, choices=["1080p", "4k"], default="1080p", help="Output resolution (1080p or 4k).")
    parser.add_argument("--clip-duration", type=float, default=4.0, help="Duration of each photo in seconds.")
    parser.add_argument("--transition-duration", type=float, default=1.5, help="Duration of crossfade in seconds.")
    parser.add_argument("--zoom-speed", type=float, default=0.15, help="Intensity of the Ken Burns zoom/pan.")
    parser.add_argument("--select", type=str, default=None, help="Comma-separated list of specific image filenames to use.")
    args = parser.parse_args()
    
    res = (1920, 1080) if args.resolution == "1080p" else (3840, 2160)
    create_cinematic_video(args.photos, args.music, args.output, res, 30, args.clip_duration, args.transition_duration, args.zoom_speed, args.select)
