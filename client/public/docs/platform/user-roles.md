---
title: "User Roles & Permissions"
description: "Understanding different user roles and their capabilities on Maximally"
category: "platform"
order: 2
---

# User Roles & Permissions

Maximally uses a role-based access control system to ensure users have appropriate permissions for their responsibilities. Here's a comprehensive guide to user roles and their capabilities.

## Role Hierarchy

```
Admin
├── Platform Moderator
├── Organizer
│   ├── Co-Organizer
│   └── Event Assistant
├── Judge
│   ├── Lead Judge
│   └── Panel Judge
└── Participant
    ├── Team Leader
    └── Team Member
```

## Participant Roles

### Participant (Base Role)
**Default role for all registered users**

**Capabilities:**
- Browse and search hackathons
- Register for events (individual or team)
- Create and manage personal profile
- Join teams via invite links
- Submit projects to hackathons
- View public project galleries
- Participate in community discussions
- Earn certificates and achievements

**Limitations:**
- Cannot create hackathons
- Cannot judge submissions
- Cannot access organizer tools
- Limited to participant-level analytics

### Team Leader
**Automatically assigned when creating a team**

**Additional Capabilities:**
- Create and manage teams
- Send team invitations
- Manage team member roles
- Submit projects on behalf of team
- Communicate with organizers
- Access team analytics and progress

**Responsibilities:**
- Coordinate team activities
- Ensure project submission compliance
- Manage team communication
- Represent team in official communications

### Team Member
**Assigned when joining a team**

**Capabilities:**
- Contribute to team projects
- Participate in team discussions
- View team progress and analytics
- Collaborate on submissions
- Receive team notifications

**Limitations:**
- Cannot modify team settings
- Cannot invite new members (unless promoted)
- Cannot submit projects independently for team events

## Organizer Roles

### Organizer (Primary)
**Users who create and manage hackathons**

**Capabilities:**
- Create and configure hackathons
- Set event themes, rules, and criteria
- Manage registrations and participants
- Configure judging workflows
- Assign judges and co-organizers
- Generate certificates and awards
- Access comprehensive event analytics
- Moderate event discussions
- Send announcements to participants

**Event Management:**
- Full control over event settings
- Participant and team management
- Submission review and organization
- Results compilation and publication
- Post-event analytics and reporting

### Co-Organizer
**Invited by primary organizers to help manage events**

**Capabilities:**
- Assist with event management
- Moderate discussions and submissions
- Communicate with participants
- Access event analytics (limited)
- Help with judging coordination

**Limitations:**
- Cannot delete or transfer event ownership
- Cannot modify core event settings
- Cannot assign other co-organizers
- Limited financial and legal access

### Event Assistant
**Limited organizer role for specific tasks**

**Capabilities:**
- Monitor event progress
- Assist with participant support
- Help with basic moderation
- Access read-only analytics

**Limitations:**
- Cannot modify event settings
- Cannot assign judges or roles
- Cannot access sensitive data
- Cannot make official announcements

## Judge Roles

### Judge (Base)
**Users invited to evaluate hackathon submissions**

**Capabilities:**
- Access assigned submissions
- Score projects based on criteria
- Provide detailed feedback
- Participate in judging discussions
- Access judging dashboard and tools
- View submission history and analytics

**Judging Process:**
- Review project documentation
- Test live demos and prototypes
- Score against evaluation criteria
- Provide constructive feedback
- Participate in deliberation sessions

### Lead Judge
**Senior judge with additional responsibilities**

**Additional Capabilities:**
- Coordinate judging panel activities
- Resolve scoring conflicts
- Moderate judge discussions
- Provide final recommendations
- Access comprehensive judging analytics
- Communicate with organizers

**Responsibilities:**
- Ensure fair and consistent evaluation
- Guide other judges through process
- Maintain judging timeline and quality
- Represent judging panel to organizers

### Panel Judge
**Specialized judge for specific categories or rounds**

**Capabilities:**
- Judge specific submission categories
- Participate in panel discussions
- Provide specialized expertise
- Access category-specific analytics

**Specializations:**
- Technical evaluation
- Business viability assessment
- Design and user experience
- Social impact evaluation
- Innovation and creativity

## Administrative Roles

### Platform Moderator
**Trusted community members with moderation powers**

**Capabilities:**
- Moderate community discussions
- Review reported content and users
- Assist with user support
- Access moderation tools and logs
- Escalate issues to administrators

**Responsibilities:**
- Maintain community standards
- Resolve user conflicts
- Ensure platform safety
- Support user onboarding

### Admin
**Full platform access and control**

**Capabilities:**
- Full access to all platform features
- User account management
- System configuration and settings
- Analytics and reporting access
- Security and compliance oversight
- Platform development coordination

**Responsibilities:**
- Platform stability and security
- User safety and compliance
- Feature development oversight
- Community governance
- Legal and regulatory compliance

## Permission Matrix

| Feature | Participant | Team Leader | Organizer | Judge | Moderator | Admin |
|---------|-------------|-------------|-----------|-------|-----------|-------|
| Browse Events | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register for Events | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Teams | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Submit Projects | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Create Events | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Judge Submissions | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Moderate Content | ❌ | ❌ | Limited | ❌ | ✅ | ✅ |
| Access Analytics | Limited | Limited | Event Only | Judge Only | Limited | Full |
| Manage Users | ❌ | Team Only | Event Only | ❌ | Limited | ✅ |

## Role Assignment Process

### Automatic Assignment
- **Participant**: Default role upon registration
- **Team Leader**: When creating a team
- **Organizer**: When creating a hackathon

### Manual Assignment
- **Judge**: Invited by organizers
- **Co-Organizer**: Invited by primary organizer
- **Moderator**: Appointed by administrators
- **Admin**: Appointed by existing administrators

### Role Transitions
- **Promotion**: Users can be promoted to higher roles
- **Temporary Roles**: Some roles are event-specific
- **Role Stacking**: Users can have multiple roles simultaneously
- **Role Expiration**: Some roles expire after events end

## Best Practices

### For Organizers
- Assign co-organizers for large events
- Clearly define judge responsibilities
- Provide role-specific training and resources
- Monitor role performance and feedback

### For Judges
- Understand evaluation criteria thoroughly
- Maintain objectivity and fairness
- Provide constructive, actionable feedback
- Communicate concerns to lead judges

### For Participants
- Respect team leader decisions
- Contribute actively to team projects
- Follow event rules and guidelines
- Engage positively with the community

### For Administrators
- Regular role audits and reviews
- Clear escalation procedures
- Comprehensive role documentation
- Regular training and updates

## Security Considerations

### Access Control
- **Principle of Least Privilege**: Users get minimum necessary permissions
- **Regular Audits**: Periodic review of role assignments
- **Session Management**: Secure login and logout processes
- **Multi-Factor Authentication**: Required for sensitive roles

### Data Protection
- **Role-Based Data Access**: Users only see relevant data
- **Audit Logging**: All role-based actions are logged
- **Privacy Controls**: Users control their data visibility
- **Compliance**: GDPR and other privacy regulations

Need help with role management? Check out our guides:
- [Becoming an Organizer](../guides/becoming-organizer.md)
- [Judge Application Process](../guides/judge-application.md)
- [Team Management](../guides/team-management.md)