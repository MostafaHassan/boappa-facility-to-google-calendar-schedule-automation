# Boappa to Google Calendar Schedule Automation

This guide will walk you through setting up the Boappa to Google Calendar Schedule Automation integration. This tool automatically creates events in Google Calendar based on whole-day facility bookings made in Boappa.

## Prerequisites

- Access to Boappa with valid credentials
- Google Calendar and Google Apps Script accounts

## Setup Instructions

### 1. Create a New Calendar in Google Calendar

1. Open [Google Calendar](https://calendar.google.com).
2. On the left sidebar, click on the **“+”** next to **“Other calendars”** and select **“Create new calendar”**.
3. Name your new calendar (e.g., "Boappa Facility Bookings").
4. Click **“Create calendar”**.
5. Once created, click on **“Settings and sharing”** for the new calendar.
6. Under **“Integrate calendar”**, find and copy the **“Calendar ID”**. You will need this for the integration.

### 2. Create a Project in Google Apps Script

1. Go to [Google Apps Script](https://script.google.com) and sign in with your Google account.
2. Click on **“New project”** to create a new script project.
3. Name your project (e.g., "Boappa to Google Calendar Integration").

### 3. Add Script Properties

1. In your Google Apps Script project, click on **“Project Settings”** (gear icon).
2. Select **“Script Properties”**.
3. Add the following script properties:

    - **boappa_username**: Your Boappa email address.
    - **boappa_password**: Your Boappa password.
    - **calendar_id**: The Calendar ID you retrieved from Google Calendar.

   For each property:
   - Click **“Add Row”**.
   - Enter the property name and value.
   - Click **“Save”**.
  
### 4. Add Script
Now copy the script (kod.js) into edit mode for that new google apps project. 
