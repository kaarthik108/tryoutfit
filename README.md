# TryOutfit

TryOutfit is an AI-powered web application that allows users to virtually try on outfits using the IDM-VTON model from Replicate. It provides an interactive and user-friendly experience for visualizing how different outfits would look on the user or on predefined models.


https://github.com/kaarthik108/tryoutfit/assets/53030784/633022c2-6819-487b-9677-f8d8133298d9


## Features

- Upload your own image or choose from predefined models
- Virtually try on outfits using AI technology
- Shareable links to generated model outfits (valid for 1 hour)
- Automatic deletion of model generations after 1 hour

## Tech Stack

- Next.js 14 (with server actions)
- AWS S3 (image storage)
- AWS DynamoDB (product data and inference data persistence)
- AWS Cognito (API key authentication)
- Replicate (AI model integration)
- AWS Amplify (hosting)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/kaarthik108/tryoutfit.git
```

2. Install dependencies:

```bash
cd tryoutfit
npm install
```

3 .Set up the required environment variables for AWS services and Replicate API key. Add tunnel to test replicate webhook `cloudflared tunnel --url http://localhost:3000` and set the TUNNEL_URL environment variable to the url provided by cloudflared
. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The application is deployed using AWS Amplify. To deploy your own instance, follow the deployment guidelines provided by AWS Amplify Gen2.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
