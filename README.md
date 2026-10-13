# VFSTR Vignan R&D Central Platform

Unified R&D Management Portal for Vignan's Foundation for Science, Technology & Research (VFSTR).

## Modules Included

1. **Student Publication Tracker**: Track and manage student research publications, review statuses, and metrics.
2. **Guideship Management Portal**: Research supervisor and guideship allocation, approvals, and evaluation workflow.
3. **Project PI Proposals**: Project proposal submissions, status tracking, reviewer workflow, disk-backed proof document storage, and gateway verification.
4. **Ph.D. Scholar Tracking**: Both Full-Time and Part-Time Ph.D. scholar monitoring, progress tracking, coursework, DC meetings, and milestone records.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL (`vignan_rd`), Supabase
- **Frontend**: HTML5, Vanilla JavaScript, CSS3
- **Authentication**: JWT, Session management, Role-based access control
- **Storage**: Disk filesystem streaming upload/download for proof documents

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mahendravarma-2005/rd.git
   cd rd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```

4. **Database Setup**:
   Import `merged_vignan_rd.sql` into your local MySQL server:
   ```bash
   mysql -u root -p vignan_rd < merged_vignan_rd.sql
   ```

5. **Start the Server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
