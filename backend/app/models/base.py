from bson import ObjectId  # type: ignore
from pydantic import BaseModel

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, *args, **kwargs):
        return {
            "type": "string",
            "format": "object-id"
        }
