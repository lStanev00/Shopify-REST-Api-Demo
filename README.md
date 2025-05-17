# Shopify-REST-Api-Demo
This API is made for consumption of a product shopify page.
## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Express.js + MongoDB Atlas
- **Image Upload:** Cloudinary + Multer 
- **Deployment:** Railway, Express, Shopify Theme (widget)

## Enviroment variables

 - MONGO_URI= Mongo DB connect URL 
 - PORT=8080
 - SHOPIFY_STORE_DOMAIN= Domain of the storefront
 - SHOPIFY_STOREFRONT_TOKEN= Storefront token
 - SHOPIFY_API_KEY=API key
 - SHOPIFY_API_SECRET_KEY= API secret key(shopify)
 - cloudinary_secret= The secret goes there


##  Features

- [x] Dynamic product data fetched from Shopify (title, image, price, etc.)

 - Review form:
- [x]  Name
- [x]  Email
- [x]  Star rating
- [x]  Title & content
- [x]  Photo upload

- [x] Like/Dislike reviews
- [x] Filter reviews by star rating Highest rating (default)
- [x] Review data stored in MongoDB
