# Relaey - CV Analyzer

Relaey is a web application designed to help you optimize your CV for job applications. It analyzes your resume against a job description, provides a compatibility score, and offers detailed recommendations for improvement.

## Features

- **CV vs. Job Description Analysis**: Upload your CV and the job vacancy to get an in-depth analysis.
- **Compatibility Score**: Get a percentage score indicating how well your CV matches the job requirements.
- **Actionable Feedback**: Receive specific suggestions to improve different sections of your CV.
- **Missing Keywords**: Identify important keywords from the job description that are missing in your resume.
- **ATS-Friendly CV**: Get a revised, ATS-friendly version of your CV content.

## Tech Stack

- **Backend**: Laravel
- **Frontend**: React, Inertia.js, TypeScript, Tailwind CSS
- **Database**: SQLite (default), configurable in `.env`

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js & npm (or bun)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/relaey.git
    cd relaey
    ```

2.  **Install PHP dependencies:**
    ```sh
    composer install
    ```

3.  **Install JavaScript dependencies:**
    ```sh
    bun install
    # or npm install
    ```

4.  **Set up your environment file:**
    Copy the example environment file and generate your application key.
    ```sh
    cp .env.example .env
    php artisan key:generate
    ```

5.  **Configure your `.env` file:**
    Open `.env` and set up your database credentials if you are not using the default SQLite configuration.

6.  **Run database migrations:**
    This will create the necessary tables in your database.
    ```sh
    php artisan migrate
    ```

## Running the Application

To start the development servers for both the backend and frontend, run the following command from the project root:

```sh
composer run dev
```

This command concurrently starts:
- The Laravel development server (usually on `http://127.0.0.1:8000`)
- The Vite development server for frontend assets.
- A queue listener for background jobs.
- Laravel Pail for real-time log monitoring.

Once the servers are running, you can access the application in your browser at the address provided by the `php artisan serve` command.