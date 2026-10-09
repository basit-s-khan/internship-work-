# Paklaunce — Week 6

**Project:** Freelancing Marketplace Platform  
**Week:** 6 — Messaging, Notifications, Reviews & Ratings  
**Brand:** Paklaunce — Only Freelance Marketplace in Pakistan

This project continues the Week 5 Orders, Contracts & Project Management build. It does not create a separate website.

## Week 6 workflow

Client / Freelancer → Message → Notification → Project Completion → Review & Rating

## New pages

- `messages.html` — conversation list, chat window, unread states, dynamic message sending, project links, search, responsive mobile chat flow.
- `notifications.html` — unread indicators, message/project/review notifications, filtering, mark-all-read, clickable notification routing.
- `reviews.html` — completed-project selector, interactive 1–5 star rating, validation, review submission, existing review cards and average rating.

## Week 5 integration

- Project Details automatically gets a **Communication & Feedback** panel.
- Active projects link to Messages and Notifications.
- Completed projects link directly to **Leave a Review**.
- Message unread counts and notification unread counts are persisted in `localStorage`.
- Week 6 data remains connected to the existing Week 5 demo projects.

## JavaScript interactions

- Switch conversations and clear unread chat counts.
- Send messages dynamically and persist them in `localStorage`.
- Search conversations.
- Filter notifications by All / Unread / Messages / Projects / Reviews.
- Mark individual notifications or all notifications as read.
- Select rating stars with live labels.
- Validate review text and rating.
- Dynamically publish reviews and recalculate average rating.
- Responsive mobile conversation-to-chat navigation.

## Technologies

HTML5, CSS3 and vanilla JavaScript only.
