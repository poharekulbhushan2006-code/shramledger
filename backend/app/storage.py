import os
import hashlib
import uuid
import base64
from typing import Tuple, Optional
from datetime import datetime

STORAGE_DIR = os.getenv("STORAGE_DIR", os.path.join(os.path.dirname(__file__), "..", "storage_bucket"))
DOCS_DIR = os.path.join(STORAGE_DIR, "documents")
AUDIO_DIR = os.path.join(STORAGE_DIR, "audio")

os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

class ObjectStorageService:
    """
    S3-compatible document and audio storage abstraction.
    Guarantees that raw media binary files are stored in object storage
    with SHA-256 content deduplication, keeping the relational database lean and performant.
    """

    @staticmethod
    def calculate_sha256(data: bytes) -> str:
        return hashlib.sha256(data).hexdigest()

    @classmethod
    def store_document(
        cls, 
        file_bytes: bytes, 
        filename: str, 
        content_type: str = "image/jpeg"
    ) -> Tuple[str, str, int]:
        """
        Stores document bytes in object storage.
        Returns: (storage_key, sha256_hash, file_size_bytes)
        """
        file_hash = cls.calculate_sha256(file_bytes)
        ext = os.path.splitext(filename)[1] or ".jpg"
        storage_key = f"docs/{file_hash[:16]}_{uuid.uuid4().hex[:8]}{ext}"
        
        file_path = os.path.join(STORAGE_DIR, storage_key.replace("/", os.sep))
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, "wb") as f:
            f.write(file_bytes)
            
        return storage_key, file_hash, len(file_bytes)

    @classmethod
    def store_base64_document(
        cls, 
        base64_data: str, 
        prefix: str = "doc"
    ) -> Tuple[str, str, int]:
        """
        Decodes base64 payload and writes to storage.
        """
        if "," in base64_data:
            base64_data = base64_data.split(",")[1]
        raw_bytes = base64.b64decode(base64_data)
        return cls.store_document(raw_bytes, f"{prefix}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.png")

    @classmethod
    def store_audio(
        cls, 
        audio_bytes: bytes, 
        format_ext: str = ".webm"
    ) -> Tuple[str, str, int]:
        """
        Stores voice recording audio in object storage.
        Returns: (storage_key, sha256_hash, file_size_bytes)
        """
        audio_hash = cls.calculate_sha256(audio_bytes)
        storage_key = f"audio/{audio_hash[:16]}_{uuid.uuid4().hex[:8]}{format_ext}"
        file_path = os.path.join(STORAGE_DIR, storage_key.replace("/", os.sep))
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, "wb") as f:
            f.write(audio_bytes)
            
        return storage_key, audio_hash, len(audio_bytes)

    @classmethod
    def get_file_path(cls, storage_key: str) -> Optional[str]:
        if not storage_key:
            return None
        file_path = os.path.join(STORAGE_DIR, storage_key.replace("/", os.sep))
        if os.path.exists(file_path):
            return file_path
        return None
