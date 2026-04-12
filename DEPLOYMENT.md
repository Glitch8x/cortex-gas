# Nosana Deployment Guide

This guide provides step-by-step instructions on how to containerize and deploy CortexGas to the Nosana GPU Network via their deployment dashboard.

## 1. Prerequisites

-   **Docker Engine** installed locally.
-   A **Docker Hub** account (create one at [hub.docker.com](https://hub.docker.com/)).
-   A **Phantom Wallet** (or Solflare) connected to Solana mainnet for using the Nosana Network.
-   **Nosana Builder Credits**. Obtain free compute credits by signing up here: [nosana.com/builders-credits](https://nosana.com/builders-credits).

---

## 2. Containerizing the Application

### Build the Docker Image

You need to build the Docker image locally. Replace `<YOUR_DOCKERHUB_USERNAME>` with your actual Docker Hub username.

```bash
docker build -t <YOUR_DOCKERHUB_USERNAME>/cortex-gas:latest .
```

### Push the Image to Docker Hub

Log in to Docker if you haven't already:

```bash
docker login
```

Push the image to your public Docker Hub repository:

```bash
docker push <YOUR_DOCKERHUB_USERNAME>/cortex-gas:latest
```

---

## 3. Deploying to Nosana

Once your image is hosted publicly on Docker Hub, you can instruct Nosana nodes to pull and run it.

1.  Navigate to the **Nosana Deployments Dashboard**: [https://deploy.nosana.com/](https://deploy.nosana.com/)
2.  Connect the Solana wallet containing your Nosana credits.
3.  Click **Create Deployment** or **New Job**.

### Application Configuration

Configure the deployment settings to match the CortexGas environment:

-   **Image URL/Name**: Enter `docker.io/<YOUR_DOCKERHUB_USERNAME>/cortex-gas:latest`
-   **Port Options**: Add an exposed port rule to expose port `3000` from the container, allowing you to access the CortexGas Dashboard.
-   **Hardware Profile**: Select an affordable GPU tier depending on your complexity needs (e.g., RTX 3080/3090, 4090, or professional series GPUs). More complex Monte Carlo simulations benefit from higher tiers.

### Environment Variables (.env config)

In the Environment Variables section on the dashboard, securely add the variables your agent needs. **Do NOT upload your local `.env` file directly to public GitHub.** Define these in the UI instead:

-   `NOSANA_API_KEY`: <Your_Nosana_API_Key>
-   `NOSANA_NETWORK`: `mainnet`
    *(Add any LLM provider keys you intend to integrate with ElizaOS here as well, e.g., `OPENAI_API_KEY`)*

### Review and Launch

1.  Review your job configuration.
2.  Agree to the terms and click **Deploy**.
3.  Approve the Solana transaction through your connected wallet. This will lock up network fees and dispatch the job to a worker node.

---

## 4. Retrieving Your Live Node URL

-   Once a node picks up your job and initializes the container, the deployment dashboard will provide a **Live URL** linked directly to port 3000 of that execution slot.
-   **Save this URL**: This specific URL is required for your official Superteam Earn Nosana Builders Challenge submission.
-   Clicking this URL will take you to your live CortexGas Dashboard powered by a decentralized GPU!
