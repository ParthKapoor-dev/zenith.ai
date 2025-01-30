class ChatbotError(Exception):
    """
    Custom exception class for handling chatbot-specific errors.
    Used to differentiate chatbot-related errors from other system exceptions.
    
    Attributes:
        message (str): Human-readable error message
        code (str, optional): Error code for categorizing errors
        details (dict, optional): Additional error context and details
    """
    
    def __init__(self, message: str, code: str = None, details: dict = None):
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(self.message)
    
    def __str__(self) -> str:
        """Return a string representation of the error"""
        if self.code:
            return f"[{self.code}] {self.message}"
        return self.message
    
    def to_dict(self) -> dict:
        """Convert the error to a dictionary format for JSON responses"""
        error_dict = {
            "error": self.message,
            "type": "chatbot_error"
        }
        
        if self.code:
            error_dict["code"] = self.code
        
        if self.details:
            error_dict["details"] = self.details
            
        return error_dict