import boto3

def upload_to_s3(file_path: str, bucket_name: str, key: str) -> str:
    """
    파일을 S3에 업로드하고 URL을 반환합니다.
    """
    s3_client = boto3.client('s3')
    s3_client.upload_file(file_path, bucket_name, key)
    return f"https://{bucket_name}.s3.amazonaws.com/{key}" 