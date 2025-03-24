// 'use client';
// import { useState, useEffect } from 'react';
// import { 
//   Container, Typography, Box, Grid, Card, Divider,
//   TextField, Button, Avatar, IconButton, Tabs, Tab,
//   List, ListItem, ListItemText, Switch, FormControlLabel,
//   Alert, Snackbar, FormControl, InputLabel, Select, MenuItem
// } from '@mui/material';
// import { 
//   Edit as EditIcon, 
//   Save as SaveIcon,
//   Upload as UploadIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon
// } from '@mui/icons-material';
// import Link from 'next/link';

// export default function SettingsPage() {
//   const [tabValue, setTabValue] = useState(0);
//   const [orgData, setOrgData] = useState({
//     name: 'Aptinova Inc.',
//     website: 'https://aptinova.com',
//     email: 'contact@aptinova.com',
//     phone: '+1 (555) 123-4567',
//     address: '123 Tech Street, San Francisco, CA 94107',
//     description: 'Aptinova is a leading technology company focused on innovative solutions for businesses.',
//     logo: '/images/company-logo.png',
//     industry: 'Technology',
//     size: '50-100',
//     founded: '2018'
//   });
  
//   const [integrations, setIntegrations] = useState([
//     { id: 'google-calendar', name: 'Google Calendar', connected: true, icon: '/integrations/google-calendar.png' },
//     { id: 'slack', name: 'Slack', connected: false, icon: '/integrations/slack.png' },
//     { id: 'zoom', name: 'Zoom', connected: true, icon: '/integrations/zoom.png' },
//     { id: 'linkedin', name: 'LinkedIn Jobs', connected: false, icon: '/integrations/linkedin.png' },
//     { id: 'github', name: 'GitHub', connected: true, icon: '/integrations/github.png' }
//   ]);
  
//   const [notifications, setNotifications] = useState({
//     newApplicant: true,
//     interviewScheduled: true,
//     assessmentCompleted: true,
//     statusChange: true,
//     teamInvites: true,
//     weeklyReports: false,
//     marketingEmails: false
//   });
  
//   const [billingInfo, setBillingInfo] = useState({
//     plan: 'Professional',
//     billingCycle: 'Annual',
//     nextBillingDate: '2024-01-15',
//     paymentMethod: 'Visa ending in 4242',
//     subscription: {
//       seats: 10,
//       usedSeats: 5,
//       activeJobs: 15,
//       maxJobs: 20,
//       price: 199
//     }
//   });

//   const [editMode, setEditMode] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleOrgDataChange = (field, value) => {
//     setOrgData(prevData => ({
//       ...prevData,
//       [field]: value
//     }));
//   };

//   const handleToggleEditMode = () => {
//     setEditMode(prev => !prev);
//   };

//   const handleSaveChanges = () => {
//     // Here you would typically save the changes to the API
//     setEditMode(false);
//     setSnackbar({
//       open: true,
//       message: 'Organization settings updated successfully',
//       severity: 'success'
//     });
//   };

//   const handleIntegrationToggle = (integrationId) => {
//     setIntegrations(prevIntegrations =>
//       prevIntegrations.map(integration =>
//         integration.id === integrationId
//           ? { ...integration, connected: !integration.connected }
//           : integration
//       )
//     );
    
//     setSnackbar({
//       open: true,
//       message: `Integration ${integrations.find(i => i.id === integrationId).connected ? 'disconnected' : 'connected'} successfully`,
//       severity: 'success'
//     });
//   };

//   const handleNotificationChange = (setting) => {
//     setNotifications(prevSettings => ({
//       ...prevSettings,
//       [setting]: !prevSettings[setting]
//     }));
//   };

//   const handleSnackbarClose = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const renderCompanyProfile = () => (
//     <Card sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h6">Company Profile</Typography>
//         <Button 
//           variant={editMode ? 'contained' : 'outlined'}
//           startIcon={editMode ? <SaveIcon /> : <EditIcon />}
//           onClick={editMode ? handleSaveChanges : handleToggleEditMode}
//         >
//           {editMode ? 'Save Changes' : 'Edit Profile'}
//         </Button>
//       </Box>

//       <Divider sx={{ mb: 3 }} />

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           <Avatar 
//             src={orgData.logo} 
//             sx={{ width: 150, height: 150, mb: 2 }} 
//             variant="rounded"
//           />
//           {editMode && (
//             <Button
//               variant="outlined"
//               component="label"
//               startIcon={<UploadIcon />}
//               size="small"
//             >
//               Upload Logo
//               <input type="file" hidden />
//             </Button>
//           )}
//         </Grid>

//         <Grid item xs={12} md={9}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Company Name"
//                 fullWidth
//                 disabled={!editMode}
//                 value={orgData.name}
//                 onChange={(e) => handleOrgDataChange('name', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Website"
//                 fullWidth
//                 disabled={!editMode}
//                 value={orgData.website}
//                 onChange={(e) => handleOrgDataChange('website', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Email"
//                 fullWidth
//                 disabled={!editMode}
//                 value={orgData.email}
//                 onChange={(e) => handleOrgDataChange('email', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Phone"
//                 fullWidth
//                 disabled={!editMode}
//                 value={orgData.phone}
//                 onChange={(e) => handleOrgDataChange('phone', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 label="Address"
//                 fullWidth
//                 disabled={!editMode}
//                 value={orgData.address}
//                 onChange={(e) => handleOrgDataChange('address', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth disabled={!editMode}>
//                 <InputLabel>Industry</InputLabel>
//                 <Select
//                   label="Industry"
//                   value={orgData.industry}
//                   onChange={(e) => handleOrgDataChange('industry', e.target.value)}
//                 >
//                   <MenuItem value="Technology">Technology</MenuItem>
//                   <MenuItem value="Finance">Finance</MenuItem>
//                   <MenuItem value="Healthcare">Healthcare</MenuItem>
//                   <MenuItem value="Education">Education</MenuItem>
//                   <MenuItem value="Manufacturing">Manufacturing</MenuItem>
//                   <MenuItem value="Retail">Retail</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth disabled={!editMode}>
//                 <InputLabel>Company Size</InputLabel>
//                 <Select
//                   label="Company Size"
//                   value={orgData.size}
//                   onChange={(e) => handleOrgDataChange('size', e.target.value)}
//                 >
//                   <MenuItem value="1-10">1-10 employees</MenuItem>
//                   <MenuItem value="11-50">11-50 employees</MenuItem>
//                   <MenuItem value="50-100">50-100 employees</MenuItem>
//                   <MenuItem value="101-500">101-500 employees</MenuItem>
//                   <MenuItem value="501-1000">501-1000 employees</MenuItem>
//                   <MenuItem value="1000+">1000+ employees</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <TextField
//                 label="Founded Year"
//                 fullWidth
//                 disabled={!editMode}
//                 value={orgData.founded}
//                 onChange={(e) => handleOrgDataChange('founded', e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 label="Company Description"
//                 fullWidth
//                 multiline
//                 rows={4}
//                 disabled={!editMode}
//                 value={orgData.description}
//                 onChange={(e) => handleOrgDataChange('description', e.target.value)}
//               />
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Card>
//   );

//   const renderIntegrations = () => (
//     <Card sx={{ p: 3 }}>
//       <Typography variant="h6" sx={{ mb: 3 }}>Integrations</Typography>
//       <Divider sx={{ mb: 3 }} />

//       <List>
//         {integrations.map((integration) => (
//           <ListItem
//             key={integration.id}
//             secondaryAction={
//               <Button 
//                 variant={integration.connected ? "outlined" : "contained"} 
//                 color={integration.connected ? "error" : "primary"}
//                 onClick={() => handleIntegrationToggle(integration.id)}
//               >
//                 {integration.connected ? 'Disconnect' : 'Connect'}
//               </Button>
//             }
//             sx={{ py: 2 }}
//           >
//             <Avatar 
//               src={integration.icon} 
//               sx={{ mr: 2, width: 40, height: 40 }} 
//               variant="square" 
//             />
//             <ListItemText 
//               primary={integration.name} 
//               secondary={integration.connected ? 'Connected' : 'Not connected'} 
//             />
//           </ListItem>
//         ))}
//       </List>

//       <Box sx={{ mt: 2, textAlign: 'center' }}>
//         <Button startIcon={<AddIcon />}>
//           Browse More Integrations
//         </Button>
//       </Box>
//     </Card>
//   );

//   const renderNotifications = () => (
//     <Card sx={{ p: 3 }}>
//       <Typography variant="h6" sx={{ mb: 3 }}>Notification Preferences</Typography>
//       <Divider sx={{ mb: 3 }} />

//       <List>
//         <ListItem>
//           <ListItemText 
//             primary="New Applicant Notifications" 
//             secondary="Get notified when new candidates apply for your jobs" 
//           />
//           <Switch 
//             checked={notifications.newApplicant}
//             onChange={() => handleNotificationChange('newApplicant')}
//             edge="end"
//           />
//         </ListItem>
//         <ListItem>
//           <ListItemText 
//             primary="Interview Scheduled" 
//             secondary="Get notified when interviews are scheduled" 
//           />
//           <Switch 
//             checked={notifications.interviewScheduled}
//             onChange={() => handleNotificationChange('interviewScheduled')}
//             edge="end"
//           />
//         </ListItem>
//         <ListItem>
//           <ListItemText 
//             primary="Assessment Completed" 
//             secondary="Get notified when candidates complete assessments" 
//           />
//           <Switch 
//             checked={notifications.assessmentCompleted}
//             onChange={() => handleNotificationChange('assessmentCompleted')}
//             edge="end"
//           />
//         </ListItem>
//         <ListItem>
//           <ListItemText 
//             primary="Candidate Status Changes" 
//             secondary="Get notified when candidate statuses change" 
//           />
//           <Switch 
//             checked={notifications.statusChange}
//             onChange={() => handleNotificationChange('statusChange')}
//             edge="end"
//           />
//         </ListItem>
//         <ListItem>
//           <ListItemText 
//             primary="Team Invites" 
//             secondary="Get notified about team invitation activities" 
//           />
//           <Switch 
//             checked={notifications.teamInvites}
//             onChange={() => handleNotificationChange('teamInvites')}
//             edge="end"
//           />
//         </ListItem>
//         <ListItem>
//           <ListItemText 
//             primary="Weekly Reports" 
//             secondary="Receive weekly summary reports" 
//           />
//           <Switch 
//             checked={notifications.weeklyReports}
//             onChange={() => handleNotificationChange('weeklyReports')}
//             edge="end"
//           />
//         </ListItem>
//         <ListItem>
//           <ListItemText 
//             primary="Marketing Emails" 
//             secondary="Receive product updates and marketing communications" 
//           />
//           <Switch 
//             checked={notifications.marketingEmails}
//             onChange={() => handleNotificationChange('marketingEmails')}
//             edge="end"
//           />
//         </ListItem>
//       </List>
//     </Card>
//   );

//   const renderBillingSubscription = () => (
//     <Card sx={{ p: 3 }}>
//       <Typography variant="h6" sx={{ mb: 3 }}>Billing & Subscription</Typography>
//       <Divider sx={{ mb: 3 }} />

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
//             <Typography variant="subtitle1" gutterBottom>Current Plan</Typography>
//             <Typography variant="h5" color="primary" gutterBottom>{billingInfo.plan}</Typography>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//               <Typography variant="body2" color="text.secondary">
//                 {billingInfo.billingCycle} billing
//               </Typography>
//               <Typography variant="body2" fontWeight="bold">
//                 ${billingInfo.subscription.price}/{billingInfo.billingCycle === 'Annual' ? 'year' : 'month'}
//               </Typography>
//             </Box>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Next billing date: {billingInfo.nextBillingDate}
//               </Typography>
//               <Typography variant="body2" fontWeight="bold">
//                 Payment method: {billingInfo.paymentMethod}
//               </Typography>
//             </Box>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Seats: {billingInfo.subscription.usedSeats}/{billingInfo.subscription.seats}
//               </Typography>
//               <Typography variant="body2" fontWeight="bold">
//                 Active jobs: {billingInfo.subscription.activeJobs}/{billingInfo.subscription.maxJobs}
//               </Typography>
//             </Box>
//           </Card>
//         </Grid>
//       </Grid>
//     </Card>
//   );

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" gutterBottom>Organization Settings</Typography>
//       <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//         <Tabs value={tabValue} onChange={handleTabChange}>
//           <Tab label="Company Profile" />
//           <Tab label="Integrations" />
//           <Tab label="Notification Preferences" />
//           <Tab label="Billing & Subscription" />
//         </Tabs>
//       </Box>

//       {tabValue === 0 && renderCompanyProfile()}
//       {tabValue === 1 && renderIntegrations()}
//       {tabValue === 2 && renderNotifications()}
//       {tabValue === 3 && renderBillingSubscription()}

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// }
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page