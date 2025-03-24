// 'use client';
// import { useState, useEffect } from 'react';
// import { 
//   Container, Typography, Box, Grid, Card, Avatar, 
//   Button, Divider, Chip, Stepper, Step, StepLabel,
//   Tabs, Tab, List, ListItem, ListItemText, ListItemIcon,
//   IconButton, TextField, Menu, MenuItem
// } from '@mui/material';
// import {
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   LinkedIn as LinkedInIcon,
//   LocationOn as LocationIcon,
//   OpenInNew as OpenInNewIcon,
//   CalendarMonth as CalendarIcon,
//   Star as StarIcon,
//   StarBorder as StarBorderIcon,
//   Download as DownloadIcon,
//   Edit as EditIcon,
//   ArrowBack as ArrowBackIcon,
//   Add as AddIcon,
//   MoreVert as MoreVertIcon
// } from '@mui/icons-material';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function ApplicantProfilePage() {
//   const { applicantid } = useParams();
//   const router = useRouter();
//   const [tabValue, setTabValue] = useState(0);
//   const [applicant, setApplicant] = useState(null);
//   const [notes, setNotes] = useState([]);
//   const [assessments, setAssessments] = useState([]);
//   const [interviews, setInterviews] = useState([]);
//   const [menuAnchorEl, setMenuAnchorEl] = useState(null);
//   const [noteText, setNoteText] = useState('');

//   useEffect(() => {
//     // Fetch applicant data from API
//     // Placeholder data
//     setApplicant({
//       id: applicantid,
//       name: 'Emily Johnson',
//       email: 'emily@example.com',
//       phone: '+1 (555) 123-4567',
//       location: 'New York, NY',
//       title: 'Senior UX Designer',
//       avatar: '/avatars/avatar2.jpg',
//       appliedDate: '2023-10-17',
//       resumeUrl: '/resumes/resume.pdf',
//       linkedin: 'linkedin.com/in/emilyjohnson',
//       portfolio: 'emilydesigns.com',
//       experience: '8+ years',
//       education: 'Master in Human-Computer Interaction, Carnegie Mellon University',
//       skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping', 'Adobe Creative Suite'],
//       jobTitle: 'UX Designer',
//       status: 'Interview',
//       rating: 4,
//       coverLetter: '<p>Dear Hiring Manager,<br><br>I am excited to apply for the UX Designer position at your company...</p>',
//       hiringProcess: [
//         { stage: 'Applied', completed: true, date: '2023-10-17' },
//         { stage: 'Resume Screening', completed: true, date: '2023-10-19' },
//         { stage: 'Interview', completed: false, date: '2023-10-25' },
//         { stage: 'Assessment', completed: false, date: null },
//         { stage: 'Offer', completed: false, date: null }
//       ]
//     });
    
//     setNotes([
//       { id: 1, text: 'Great portfolio with strong visual design skills', author: 'Alex Rodriguez', date: '2023-10-19', authorAvatar: '/avatars/recruiter1.jpg' },
//       { id: 2, text: 'Candidate has experience with our tech stack and seems enthusiastic about our product', author: 'Jamie Smith', date: '2023-10-20', authorAvatar: '/avatars/recruiter2.jpg' }
//     ]);
    
//     setAssessments([
//       { id: 1, name: 'UX Design Challenge', status: 'Completed', score: '92%', completedDate: '2023-10-22' }
//     ]);
    
//     setInterviews([
//       { id: 1, type: 'Initial Screening', date: '2023-10-19', time: '10:00 AM', interviewer: 'Jamie Smith', feedback: 'Positive initial impression, good communication skills' },
//       { id: 2, type: 'Technical Interview', date: '2023-10-25', time: '2:00 PM', interviewer: 'Alex Rodriguez', feedback: null }
//     ]);
//   }, [applicantid]);

//   if (!applicant) {
//     return <Container><Typography>Loading...</Typography></Container>;
//   }

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const handleMenuOpen = (event) => {
//     setMenuAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchorEl(null);
//   };

//   const handleAddNote = () => {
//     if (noteText.trim()) {
//       const newNote = {
//         id: notes.length + 1,
//         text: noteText,
//         author: 'Current User', // Replace with actual user info
//         date: new Date().toISOString().split('T')[0],
//         authorAvatar: '/avatars/current-user.jpg' // Replace with actual avatar
//       };
      
//       setNotes([newNote, ...notes]);
//       setNoteText('');
//     }
//   };

//   const renderBasicInfo = () => (
//     <Card sx={{ p: 3, mb: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//         <Typography variant="h6">Basic Information</Typography>
//         <Button startIcon={<EditIcon />} size="small">Edit</Button>
//       </Box>
//       <Divider sx={{ mb: 3 }} />
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <List dense disablePadding>
//             <ListItem disableGutters>
//               <ListItemIcon sx={{ minWidth: 40 }}>
//                 <EmailIcon color="primary" fontSize="small" />
//               </ListItemIcon>
//               <ListItemText primary="Email" secondary={applicant.email} />
//             </ListItem>
//             <ListItem disableGutters>
//               <ListItemIcon sx={{ minWidth: 40 }}>
//                 <PhoneIcon color="primary" fontSize="small" />
//               </ListItemIcon>
//               <ListItemText primary="Phone" secondary={applicant.phone} />
//             </ListItem>
//             <ListItem disableGutters>
//               <ListItemIcon sx={{ minWidth: 40 }}>
//                 <LocationIcon color="primary" fontSize="small" />
//               </ListItemIcon>
//               <ListItemText primary="Location" secondary={applicant.location} />
//             </ListItem>
//           </List>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <List dense disablePadding>
//             <ListItem disableGutters>
//               <ListItemIcon sx={{ minWidth: 40 }}>
//                 <LinkedInIcon color="primary" fontSize="small" />
//               </ListItemIcon>
//               <ListItemText 
//                 primary="LinkedIn" 
//                 secondary={
//                   <Link href={`https://${applicant.linkedin}`} target="_blank">
//                     {applicant.linkedin}
//                   </Link>
//                 }
//               />
//             </ListItem>
//             {applicant.portfolio && (
//               <ListItem disableGutters>
//                 <ListItemIcon sx={{ minWidth: 40 }}>
//                   <OpenInNewIcon color="primary" fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText 
//                   primary="Portfolio" 
//                   secondary={
//                     <Link href={`https://${applicant.portfolio}`} target="_blank">
//                       {applicant.portfolio}
//                     </Link>
//                   }
//                 />
//               </ListItem>
//             )}
//             <ListItem disableGutters>
//               <ListItemIcon sx={{ minWidth: 40 }}>
//                 <CalendarIcon color="primary" fontSize="small" />
//               </ListItemIcon>
//               <ListItemText 
//                 primary="Applied On" 
//                 secondary={new Date(applicant.appliedDate).toLocaleDateString()} 
//               />
//             </ListItem>
//           </List>
//         </Grid>
//       </Grid>
//     </Card>
//   );

//   const renderResume = () => (
//     <Card sx={{ p: 3, mb: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//         <Typography variant="h6">Resume & Cover Letter</Typography>
//         <Button startIcon={<DownloadIcon />} size="small">Download</Button>
//       </Box>
//       <Divider sx={{ mb: 3 }} />
      
//       <Typography variant="subtitle1" sx={{ mb: 1 }}>Experience</Typography>
//       <Typography variant="body2" sx={{ mb: 2 }}>{applicant.experience}</Typography>
      
//       <Typography variant="subtitle1" sx={{ mb: 1 }}>Education</Typography>
//       <Typography variant="body2" sx={{ mb: 2 }}>{applicant.education}</Typography>
      
//       <Typography variant="subtitle1" sx={{ mb: 1 }}>Skills</Typography>
//       <Box sx={{ mb: 2 }}>
//         {applicant.skills.map((skill, index) => (
//           <Chip key={index} label={skill} size="small" sx={{ mr: 1, mb: 1 }} />
//         ))}
//       </Box>
      
//       <Typography variant="subtitle1" sx={{ mb: 1 }}>Cover Letter</Typography>
//       <Box dangerouslySetInnerHTML={{ __html: applicant.coverLetter }} />
//     </Card>
//   );

//   const renderNotes = () => (
//     <Card sx={{ p: 3, mb: 3 }}>
//       <Typography variant="h6" sx={{ mb: 2 }}>Notes</Typography>
//       <Box sx={{ mb: 3 }}>
//         <TextField
//           fullWidth
//           multiline
//           rows={3}
//           placeholder="Add a note about this candidate..."
//           value={noteText}
//           onChange={(e) => setNoteText(e.target.value)}
//           sx={{ mb: 1 }}
//         />
//         <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//           <Button 
//             variant="contained" 
//             size="small" 
//             onClick={handleAddNote}
//             disabled={!noteText.trim()}
//           >
//             Add Note
//           </Button>
//         </Box>
//       </Box>
      
//       <Divider sx={{ mb: 2 }} />
      
//       <List>
//         {notes.map((note) => (
//           <ListItem key={note.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', pb: 2 }}>
//             <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
//               <Avatar src={note.authorAvatar} sx={{ width: 32, height: 32, mr: 1 }} />
//               <Box>
//                 <Typography variant="subtitle2">{note.author}</Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   {new Date(note.date).toLocaleDateString()}
//                 </Typography>
//               </Box>
//               <Box sx={{ flexGrow: 1 }} />
//               <IconButton size="small">
//                 <MoreVertIcon fontSize="small" />
//               </IconButton>
//             </Box>
//             <Typography variant="body2" sx={{ pl: 5 }}>{note.text}</Typography>
//           </ListItem>
//         ))}
//       </List>
//     </Card>
//   );

//   const renderInterviews = () => (
//     <Card sx={{ p: 3, mb: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//         <Typography variant="h6">Interviews</Typography>
//         <Button startIcon={<AddIcon />} size="small">Schedule Interview</Button>
//       </Box>
//       <Divider sx={{ mb: 3 }} />
      
//       <List>
//         {interviews.map((interview) => (
//           <ListItem 
//             key={interview.id} 
//             sx={{ 
//               border: '1px solid #e0e0e0', 
//               borderRadius: 1, 
//               mb: 2,
//               flexDirection: 'column',
//               alignItems: 'flex-start'
//             }}
//           >
//             <Box sx={{ 
//               display: 'flex', 
//               width: '100%', 
//               p: 1,
//               backgroundColor: interview.feedback ? '#f0f7ff' : '#fff9c4',
//               borderTopLeftRadius: 4,
//               borderTopRightRadius: 4
//             }}>
//               <Box>
//                 <Typography variant="subtitle1">{interview.type}</Typography>
//                 <Typography variant="body2">
//                   {interview.date} at {interview.time} • {interview.interviewer}
//                 </Typography>
//               </Box>
//               <Box sx={{ flexGrow: 1 }} />
//               <Chip 
//                 label={interview.feedback ? 'Completed' : 'Scheduled'} 
//                 color={interview.feedback ? 'success' : 'warning'} 
//                 size="small" 
//               />
//             </Box>
            
//             {interview.feedback && (
//               <Box sx={{ p: 2, width: '100%' }}>
//                 <Typography variant="subtitle2">Feedback:</Typography>
//                 <Typography variant="body2">{interview.feedback}</Typography>
//               </Box>
//             )}
            
//             {!interview.feedback && (
//               <Box sx={{ p: 2, width: '100%' }}>
//                 <Button variant="outlined" size="small">Add Feedback</Button>
//               </Box>
//             )}
//           </ListItem>
//         ))}
//       </List>
//     </Card>
//   );

//   const renderAssessments = () => (
//     <Card sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//         <Typography variant="h6">Assessments</Typography>
//         <Button startIcon={<AddIcon />} size="small">Send Assessment</Button>
//       </Box>
//       <Divider sx={{ mb: 3 }} />
      
//       {assessments.length > 0 ? (
//         <List>
//           {assessments.map((assessment) => (
//             <ListItem 
//               key={assessment.id} 
//               sx={{ 
//                 border: '1px solid #e0e0e0', 
//                 borderRadius: 1, 
//                 mb: 2
//               }}
//             >
//               <ListItemText 
//                 primary={assessment.name} 
//                 secondary={`Completed on ${new Date(assessment.completedDate).toLocaleDateString()}`} 
//               />
//               <Box>
//                 <Chip 
//                   label={assessment.score} 
//                   color={
//                     parseFloat(assessment.score) > 80 ? 'success' : 
//                     parseFloat(assessment.score) > 60 ? 'warning' : 'error'
//                   } 
//                 />
//               </Box>
//             </ListItem>
//           ))}
//         </List>
//       ) : (
//         <Typography variant="body2" color="text.secondary">
//           No assessments have been sent to this candidate yet.
//         </Typography>
//       )}
//     </Card>
//   );

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ display: 'flex', mb: 3 }}>
//         <Button 
//           startIcon={<ArrowBackIcon />}
//           onClick={() => router.push('/orgs/applicants')}
//         >
//           Back to All Applicants
//         </Button>
//       </Box>
      
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ p: 3, mb: 3, textAlign: 'center' }}>
//             <Avatar 
//               src={applicant.avatar} 
//               sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }} 
//             />
//             <Typography variant="h5" sx={{ mb: 0.5 }}>{applicant.name}</Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
//               {applicant.title}
//             </Typography>
            
//             <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
//               {[...Array(5)].map((_, index) => (
//                 index < applicant.rating ? 
//                   <StarIcon key={index} sx={{ color: '#FFD700' }} /> : 
//                   <StarBorderIcon key={index} sx={{ color: '#FFD700' }} />
//               ))}
//             </Box>
            
//             <Chip 
//               label={applicant.status} 
//               color={getStatusColor(applicant.status)}
//               sx={{ mb: 2 }}
//             />
            
//             <Box sx={{ textAlign: 'left' }}>
//               <Typography variant="subtitle1" sx={{ mb: 1 }}>Hiring Progress</Typography>
//               <Stepper 
//                 activeStep={applicant.hiringProcess.findIndex(stage => !stage.completed)} 
//                 orientation="vertical" 
//                 sx={{ mb: 2 }}
//               >
//                 {applicant.hiringProcess.map((stage, index) => (
//                   <Step key={index}>
//                     <StepLabel>
//                       <Typography variant="body2">
//                         {stage.stage}
//                         {stage.date && 
//                           <Typography variant="caption" component="span" sx={{ ml: 1 }}>
//                             ({new Date(stage.date).toLocaleDateString()})
//                           </Typography>
//                         }
//                       </Typography>
//                     </StepLabel>
//                   </Step>
//                 ))}
//               </Stepper>
//             </Box>
            
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
//               <Button 
//                 variant="outlined" 
//                 onClick={handleMenuOpen}
//                 endIcon={<MoreVertIcon />}
//               >
//                 Actions
//               </Button>
//               <Button variant="contained">Move to Next Stage</Button>
//             </Box>
//           </Card>
          
//           <Card sx={{ p: 3 }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>Attached Documents</Typography>
//             <List>
//               <ListItem 
//                 button 
//                 component="a" 
//                 href={applicant.resumeUrl} 
//                 target="_blank"
//               >
//                 <ListItemIcon>
//                   <DownloadIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="Resume.pdf" />
//               </ListItem>
//               <ListItem button>
//                 <ListItemIcon>
//                   <DownloadIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="Cover Letter.pdf" />
//               </ListItem>
//               <ListItem button>
//                 <ListItemIcon>
//                   <DownloadIcon />
//                 </ListItemIcon>
//                 <ListItemText primary="Portfolio.pdf" />
//               </ListItem>
//             </List>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} md={8}>
//           <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
//             <Tab label="Overview" />
//             <Tab label="Resume" />
//             <Tab label="Notes" />
//             <Tab label="Interviews" />
//             <Tab label="Assessments" />
//           </Tabs>
          
//           {tabValue === 0 && (
//             <>
//               {renderBasicInfo()}
//               {renderResume()}
//               {renderInterviews()}
//             </>
//           )}
          
//           {tabValue === 1 && renderResume()}
//           {tabValue === 2 && renderNotes()}
//           {tabValue === 3 && renderInterviews()}
//           {tabValue === 4 && renderAssessments()}
//         </Grid>
//       </Grid>
      
//       <Menu
//         anchorEl={menuAnchorEl}
//         open={Boolean(menuAnchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleMenuClose}>Schedule Interview</MenuItem>
//         <MenuItem onClick={handleMenuClose}>Send Assessment</MenuItem>
//         <MenuItem onClick={handleMenuClose}>Send Email</MenuItem>
//         <MenuItem onClick={handleMenuClose}>Change Status</MenuItem>
//         <MenuItem onClick={handleMenuClose}>Create Offer</MenuItem>
//         <MenuItem onClick={handleMenuClose}>Reject Candidate</MenuItem>
//       </Menu>
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