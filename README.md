Project: Crypto Dashboard
Conor Steward
12/19/24
1conorsteward@gmail.com


Overview

The Crypto Dashboard is a responsive web application designed for cryptocurrency enthusiasts to monitor live prices, view historical trends, and compare current and average monthly costs of popular cryptocurrencies. The project is built using modern technologies such as React, Tailwind CSS, and Chart.js, ensuring a seamless user experience with a visually appealing design.

Features

Live Prices: Real-time updates for selected cryptocurrencies using the CoinGecko API.

Historical Charts: Interactive charts displaying historical price data for the past 90 days.

Caching and Performance Optimization: Implements caching and rate-limited API calls to optimize performance and reduce redundant requests.

Light and Dark Modes: Adapts to the user's preferred color scheme with smooth visual transitions.

Responsive Design: Works seamlessly across devices, from mobile phones to desktops.

Technologies Used

React: For building the user interface and managing state.

Tailwind CSS: For styling the application with a modern, utility-first approach.

Chart.js: For rendering dynamic and interactive charts.

CoinGecko API: For fetching live and historical cryptocurrency data.

Axios: For handling API requests.

Installation

Clone the repository:

git clone https://github.com/1conorsteward/crypto-dashboard.git
cd crypto-dashboard

Install dependencies:

npm install

Start the development server:

npm start

Open your browser and navigate to http://localhost:3000 to view the application.

Usage

Use the navigation tabs to select a cryptocurrency (e.g., Bitcoin, Ethereum, Tellor).

View the live price and historical chart for the selected coin.

Analyze the average monthly cost and compare it to the current price.

Environment Variables

To use the CoinGecko API effectively, you can configure environment variables if needed. Create a .env file in the root directory and add the following:

REACT_APP_API_BASE_URL=https://api.coingecko.com/api/v3

Scripts

npm start: Starts the development server.

npm run build: Builds the application for production.

npm run lint: Runs ESLint to check for coding style issues.

npm test: Runs the test suite (if implemented).

Contributing

Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch:

git checkout -b feature-name

Make your changes and commit them:

git commit -m "Description of changes"

Push your branch:

git push origin feature-name

Open a pull request.

License

This project is licensed under the MIT License.

Acknowledgements

CoinGecko for providing API access.

Tailwind CSS for making styling intuitive and efficient.

Chart.js for creating interactive and dynamic charts.

Contact

For any questions or feedback, feel free to contact your-email@example.com.

Happy coding!