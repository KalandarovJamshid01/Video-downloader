import yt_dlp
import os
import uuid

def download_video(url: str, download_path='downloads/') -> str:
    os.makedirs(download_path, exist_ok=True)
    file_id = str(uuid.uuid4())
    output_path = os.path.join(download_path, f"{file_id}.mp4")

    ydl_opts = {
        'outtmpl': output_path,
        'format': 'mp4',
        'quiet': True,
        'no_warnings': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    return output_path
