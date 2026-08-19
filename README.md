# Frontend to Full-Stack

Please analyze all my uploaded HTML frontend files (admin.html, blog.html, contact.html, pricing.html, etc.). Convert this static site into a full-stack SaaS platform using Lovable Cloud (PostgreSQL backend). First, generate database tables and relationships for:

users (id, email, password, role [ADMIN/USER], subscription_plan, stripe_customer_id)

products (id, name, category, price, created_at) matching my admin table

posts (id, title, category, date, content, image_url, created_at) matching my blog table

messages (id, name, email, company, subject, message, created_at) for contact submissions Enable Row Level Security (RLS) on all tables.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a80dcfcd-5d8a-4075-a796-1eaf125d12a8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
