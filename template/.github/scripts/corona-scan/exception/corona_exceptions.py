class ImageNotFoundException(Exception):
    def __init__(self, image_name, message=None):
        if message is None:
            message = f"There was no component group or image found in corona with the name '{image_name}'"
        super().__init__(message)
        self.image_name = image_name
