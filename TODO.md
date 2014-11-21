# Todo List

## Application Design

- FIXME: Adjust experiment to work correctly on narrower screens
- TODO: Add personality questions screen
- TODO: Add emotion index screen
- FIXME: Address layout issues
- TODO: Add timeout that returns to the home screen after n minutes

## Utilities

- TODO: Write daily server backup script

## General

- TODO: Follow-up with Vilvite on TeamViewer installation
- FIXME: Update text throughout experiment

## Instructions screen

- FIXME: Allow instructions to specify number of excerpts dynamically

## Questionnaire screens

- FIXME: Show numbers above radio button selections
- FIXME: Consider how to handle different questions for different songs (e.g., asking about familiarity for control sound)
- TODO: Convert options to a single format instead of radioOptions, dropdownOptions, etc.
- FIXME: Fix media questionnaire responses that don't make it into Trial Data

## Media Playback screens

- FIXME: Address error when an OSC message is sent without a session ID
- TODO: Use different colors for Playback and Continue buttons
- TODO: Request and save emotion indices

## Demographics screen

- FIXME: Collect age instead of birth year

## Signal test screen

- TODO: Watch for and log sensor issues
- TODO: In the event of sensor issues, still allow user to advance after delay

## Start screen

- TODO: Update tests that hit the socket (here and elsewhere) to use mock socket
- TODO: Populate date in Trial Data

## Trial Data

- TODO: Push results to database when experiment completes
- FIXME: Remove most engaged and most enjoyed
- TODO: Add formatting and type options when saving arbitrary data
- FIXME: Gracefully handle bad array indices when saving arbitrary data

## OSC server controller

- FIXME: Restructure module to return object
- FIXME: Handle Max errors in Angular in order to display something meaningful to the user