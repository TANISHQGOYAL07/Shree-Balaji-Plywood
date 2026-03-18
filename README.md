# 🪵 Shri Balaji Wood Management System

A comprehensive, responsive, and secure management platform designed for **Shri Balaji Wood**, a premium manufacturer of high-quality **Plypatta (Core Veneer)** based in Yamunanagar, Haryana.

---

## 🚀 The Three Portals

The system is divided into three distinct functional areas to serve different stakeholders:

### 🌐 1. Public Website (Customer-Facing)
**File:** `index.html`
- **Purpose**: Showcasing the brand, products, and location to potential clients.
- **Key Features**:
  - Premium, responsive design with smooth animations.
  - Interactive **Product Showcase** for Plypatta.
  - **Embedded Factory Map** with Google Maps directions.
  - SEO-optimized with semantic HTML5 and modern typography (Outfit & Playfair Display).
- **Access**: Open to everyone.

### 🔐 2. Admin Dashboard (Owner/Management)
**File:** `admin.html`
- **Purpose**: Internal business operations management.
- **Key Features**:
  - **Security**: PIN-protected access (Default: `1234`).
  - **Ledger System**: Track income, payments, and balances.
  - **Inventory Management**: Monitor Plywood and Plypatta stock.
  - **Human Resources**: Manage employee attendance and payroll.
  - **Real-time Logistics**: Trolley tracking and dispatch management.
  - **Customer Message Management**: View and manage inquiries from the public website.
  - **Data Controls**: Export business data as JSON for backups.
- **Access**: Authorized personnel only.

### 🕒 3. Employee Check-in (Workforce)
**File:** `checkin.html`
- **Purpose**: Simplified interface for daily attendance marking.
- **Key Features**:
  - Mobile-first, "Add to Home Screen" friendly.
  - Location-aware check-in (requires GPS).
  - One-tap attendance submission.
- **Access**: Shared via QR code or link with factory workers.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+)
- **Icons**: Font Awesome 6.4.0
- **Typography**: Google Fonts (Outfit, Playfair Display)
- **Maps**: Leaflet.js (OpenStreetMap)
- **Storage**: Browser LocalStorage (No backend required for basic operation)

---

## 📋 Getting Started

### Local Setup
1. Clone or download this repository to your local machine.
2. Navigate to the `shri_balaji_wood` directory.
3. Simply double-click `index.html` to launch the site in any modern browser.

### Mobile Access for Workers
1. Host the folder on a local network or web server.
2. Share the URL of `checkin.html` with employees.
3. Employees can use their mobile browsers and "Add to Home Screen" for a native app-like experience.

---

## 🛡️ Security & Data

| Feature | Description |
| :--- | :--- |
| **Admin Access** | Default PIN is `1234`. To change, use the browser console: `localStorage.setItem('sbp_admin_pin', 'NEW_PIN')`. |
| **Data Privacy** | All business data remains on the device it's entered on (LocalStorage). No data is sent to external servers. |
| **Backup Strategy** | Regularly use the **Export** button in the Admin Dashboard to save a JSON copy of your records. |
| **Idle Security** | Always click **"Lock Dashboard"** in the sidebar before leaving your computer. |

---

## 📂 Project Structure

```text
shri_balaji_wood/
├── index.html          # Main customer website
├── admin.html          # PIN-protected business dashboard
├── checkin.html        # Simple worker attendance portal
├── styles.css          # Main site styles & design system
├── admin-styles.css    # Dashboard-specific styling
├── script.js           # Public site interactivity & maps
├── admin-script.js     # Core business logic & state management
├── images/             # Product images and brand assets
└── LICENSE             # MIT License
```

---

## 📧 Contact & Support

**Shri Balaji Wood**
- 📍 **Location**: Industrial Area, Yamunanagar, Haryana
- 📞 **Phone**: +91 98765 43210
- ✉️ **Email**: info@shribalajiwood.com
- 🗺️ [Get Directions on Google Maps](https://www.google.com/maps/dir/?api=1&destination=30.1185467,77.2461462)

---

*&copy; 2026 Shri Balaji Wood. Manufactured with precision, designed for durability.*
