SHash is not a cryptographic hashing algorithm, it is a collection of hashing helpers.

The S in SHash stands for Secure, Stateful, and Simple.

SHash requires a storage interface to be passed in, which is used to store the stateful salt.

SHash aims to be simple and easy to use, and provides multiple layers of security:  
SHash is stateful, which means that there is a layer of database/storage.  
SHash allows you to specify your additional salt, which could add two layers: hard-coded salt and environment salt.  

SHash supports any hashing algorithm, it is recommended to use SHA256 for the balance of security and performance,  
Do note that SHA256 is NOT SAFE for highly sensitive information like passwords.
