from gtts import gTTS
import os
import uuid
import boto3

s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name=os.environ.get("AWS_REGION")
)

S3_BUCKET = os.environ.get("S3_BUCKET_NAME")

def synthesize_speech(text: str, output_path: str = None) -> str:
    """
    Convert text to speech using gTTS.
    Saves the MP3 file and returns the path.
    """
    try:
        if not text:
            print("No text provided for TTS.")
            return ""

        # Create a temporary path
        filename = f"{uuid.uuid4()}.mp3"
        temp_path = f"{filename}"

        # Generate speech
        tts = gTTS(text=text, lang='en')
        tts.save(filename)
        print(f"TTS audio saved to: {filename}")
        # Synthesize and save
        # tts = gTTS(text=text, lang='en')
        # tts.save(filename)

        s3.upload_file(filename, S3_BUCKET, filename, ExtraArgs={'ContentType': 'audio/mpeg'})
        print(f"Uploaded TTS audio to S3: {filename}")
        # Cleanup temp file
        os.remove(temp_path)
        url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': S3_BUCKET, 'Key': filename},
            ExpiresIn=3600  # 1 hour
        )

        # Return public S3 URL
        return url

        # print(f"TTS audio saved to: {filename}")
        # return filename

    except Exception as e:
        print(f"Error during TTS synthesis: {e}")
        return ""
