import bcrypt

def hash_password(password):
    """
    Hash a password with a randomly generated salt.
    
    Parameters:
    - password (str): The password to hash.
    
    Returns:
    - str: The hashed password.
    """
    # convert to bytes
    password_bytes = password.encode('utf-8')
    
    # create salt (added secutity) and then hash
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt)
    
    return hashed_password.decode('utf-8')

# example
password = "my_secure_password"
hashed_password = hash_password(password)
print(f"Original: {password}")
print(f"Hashed: {hashed_password}")
