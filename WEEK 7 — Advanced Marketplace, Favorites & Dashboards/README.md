# Paklaunce — Week 7

**Project:** Freelancing Marketplace Platform  
**Week:** 7 — Advanced Marketplace, Favorites & Dashboards  
**Brand:** Paklaunce — Only Freelance Marketplace in Pakistan

Week 7 continues the Week 1–6 project in this directory. All earlier pages and workflows are preserved, with new marketplace search, saved items, dashboards and live demo statistics.

## Week 7 features

- `browse.html` — Search services, freelancers, jobs, skills and categories; refine by category, price/budget, rating, delivery time and experience; sort by price, rating, popularity or newest.
- `favorites.html` — Save and remove services or freelancers. Favorites persist in this browser using `localStorage`.
- `dashboard.html` — Switch between freelancer and client views for services, jobs, proposals, orders, projects, earnings or project value, reviews and messages.
- Home and dashboard marketplace statistics — Listing counts, ratings, order/project totals and available project value are derived from the Week 1–6 demo data.

Rating, delivery-time and experience filters apply to service/freelancer data. Jobs do not contain those fields, so they are not included while one of those filters is active. Job budgets are matched by overlap with the selected price range.

## Week 1–6 compatibility

The existing home, service, job, profile, proposal, project, messaging, notification and review pages remain in this Week 7 directory. Their existing browser storage and interactions are retained. Week 7 favorites use a separate storage key.

## Run locally

Open `index.html` in a modern browser. The project uses HTML, CSS and vanilla JavaScript only; demo data and favorites are stored locally in the browser.
