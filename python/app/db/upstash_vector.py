from upstash_vector import Index
from app.config import UPSTASH_TOKEN , UPSTASH_URL

index = Index(url=UPSTASH_URL, token=UPSTASH_TOKEN)
