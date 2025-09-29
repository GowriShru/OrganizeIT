# OrganizeIT Platform Guidelines

## Overview
OrganizeIT is a comprehensive AI-driven platform for intelligent IT operations that unifies IT operations, FinOps, ESG monitoring, project collaboration, and decentralized identity management in hybrid cloud environments.

## Core Functionalities

### 1. Authentication & User Management
- **Secure Login**: Demo credentials (`demo@organizeit.com` / `demo123`) or any email/password combination
- **User Profiles**: Comprehensive profile management with preferences, security settings, and activity tracking
- **Session Management**: "Remember Me" functionality with localStorage persistence
- **Role-Based Access**: Support for different user roles (System Administrator, DevOps Engineer, IT Manager, etc.)

### 2. Global Search (Cmd/Ctrl + K)
- **Cross-Module Search**: Search across all dashboards, metrics, alerts, reports, and settings
- **Intelligent Results**: Context-aware search with relevance ranking
- **Quick Access**: One-click navigation to system alerts, cost reports, performance metrics, and ESG data
- **Recent Searches**: Track and easily access previous search queries

### 3. Notification Center
- **Real-Time Alerts**: System notifications for critical issues, cost optimization opportunities, and security events
- **Categorized Notifications**: Organized by type (alerts, cost, security, ESG, info)
- **Priority Filtering**: Filter by priority level (critical, high, medium, low)
- **Action Items**: Direct links to resolve issues or implement recommendations
- **Smart Notifications**: Live notification indicator in sidebar

### 4. Export Manager
- **Multi-Format Export**: Support for PDF, Excel, CSV, JSON, PNG, SVG formats
- **Bulk Operations**: Select and export multiple reports simultaneously
- **Custom Date Ranges**: Flexible time period selection for data exports
- **Content Options**: Choose to include charts, raw data, or both
- **Compression Settings**: Optimize file sizes with configurable compression levels

### 5. Theme Management
- **Light/Dark Mode**: Full theme switching with system preference detection
- **Persistent Settings**: Theme preferences saved across sessions
- **Accessible Design**: High contrast and readable typography in all themes

### 6. AI-Powered Chatbot
- **Context-Aware Responses**: Intelligent assistance based on current module
- **Quick Actions**: One-click shortcuts for optimization, alerts, cost analysis, and ESG reports
- **Interactive Suggestions**: Follow-up recommendations and actionable insights
- **Real-Time Integration**: Connect to backend APIs for live data analysis

## Design System Guidelines

### Typography
- Base font size: 16px (defined in CSS variables)
- Headings use medium font weight (500)
- Body text uses normal font weight (400)
- Respect existing typography hierarchy without overriding with Tailwind text classes

### Color System
- Primary: #030213 (dark blue-black)
- Secondary: Light gray tones for supporting elements
- Accent colors for different data types:
  - Red (#d4183d) for alerts and critical issues
  - Green for success states and ESG metrics
  - Blue for informational content
  - Purple for cost-related data
  - Orange for warnings

### Layout Principles
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Consistent Spacing**: Use standard padding and margin classes
- **Grid Systems**: Utilize CSS Grid and Flexbox for layout structure
- **Card-Based Design**: Group related content in card components
- **Sidebar Navigation**: Fixed 64-unit width sidebar with collapsible sections

### Component Usage
- **ShadCN Components**: Utilize the comprehensive UI component library
- **Consistent Interactions**: Hover states, focus indicators, and smooth transitions
- **Loading States**: Skeleton loaders and progress indicators for async operations
- **Error Handling**: Clear error messages with actionable recovery suggestions

### Data Visualization
- **Chart Colors**: Use CSS custom properties for consistent chart theming
- **Accessibility**: Ensure charts are readable in both light and dark themes
- **Interactive Elements**: Tooltips, hover states, and drill-down capabilities
- **Real-Time Updates**: Smooth animations for live data changes

## Keyboard Shortcuts
- **Cmd/Ctrl + K**: Open global search
- **Escape**: Close any open modal or overlay
- **Cmd/Ctrl + /**: Show help/shortcuts (future implementation)

## Performance Guidelines
- **Lazy Loading**: Load components and data only when needed
- **Efficient State Management**: Minimize unnecessary re-renders
- **Optimized Images**: Use appropriate formats and sizes
- **Code Splitting**: Split large components into smaller, focused modules

## Security Considerations
- **No Sensitive Data**: Avoid storing sensitive information in localStorage
- **Demo Mode**: Current implementation uses demo data for safety
- **Input Validation**: Sanitize all user inputs
- **Secure Communication**: HTTPS for all API communications (when implemented)

## Accessibility Standards
- **Keyboard Navigation**: Full functionality accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Meet WCAG 2.1 AA standards
- **Focus Management**: Clear focus indicators and logical tab order

## Development Notes
- **Component Structure**: Keep components focused and reusable
- **File Organization**: Group related components in logical directories
- **TypeScript**: Use proper typing for all component props and state
- **Error Boundaries**: Implement error handling at component level
- **Testing**: Design components with testability in mind