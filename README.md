# AWS Route 53 Clone

A full-stack cloud DNS management web application inspired by **Amazon Route 53**, connecting a Next.js frontend deployed on Vercel with a FastAPI backend hosted on Render.

###  Tech Stack

* **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS) - Hosted on **Vercel**
* **Backend:** FastAPI (Python, SQLAlchemy, SQLite) - Hosted on **Render**

###  Features

* **Hosted Zone Management:** Create, view, and delete hosted domains and zones.
* **DNS Record Management:** Add and delete DNS records (`A`, `AAAA`, `CNAME`, `TXT`) dynamically per zone.
* **Live Record Tracking & Persistence:** Automated TTL configuration and permanent database persistence across refreshes.
