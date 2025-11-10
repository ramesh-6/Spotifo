# Music Database API (SPOTIFO)
A full-stack music information platform providing comprehensive song data through RESTful APIs. Built with Spring Boot backend and React frontend, featuring advanced search capabilities, data visualization, and Spotify integration.​

## Overview
This application serves as a complete music database solution offering detailed song information, metadata, and analytics. The backend provides robust REST endpoints with enterprise-grade features including pagination, filtering, sorting, and search capabilities. The frontend delivers an interactive user experience with data visualizations and direct Spotify playback integration.​

## Tech Stack

### Backend (Primary Focus)

Java 21

Spring Boot 3.5.5 - Application framework

Spring Data JPA - Data persistence layer

Hibernate - ORM implementation

Lombok - Boilerplate code reduction

MySQL - Database

H2 Database - Development/testing

SpringDoc OpenAPI - API documentation (Swagger UI)

Maven - Dependency management

### Frontend

React.js - UI framework

## Key Features
### Data Management:

Dual database architecture (song + songv2) with one-to-one relationships

Extended song metadata and additional attributes

JPA entity relationships with optimized queries

Transaction management and data integrity

### Search & Filtering:

Advanced keyword search across multiple fields (title, artist, album, genre)

Multi-criteria filtering (year, popularity)

Dynamic query building with JPA Specifications

Case-insensitive search support

### Sorting & Pagination:

Flexible sorting on any field (ascending/descending)

Efficient pagination with configurable page size

Total count and page metadata in responses

Performance-optimized queries for large datasets

### API Features:

RESTful endpoint design following best practices

Comprehensive error handling with custom exceptions

CORS configuration for cross-origin requests

Standardized JSON response format​

### Frontend Features:
Interactive data visualization dashboard

Song and trend statistics

Spotify play button with external redirect

Responsive UI design

Real-time search and filtering​
