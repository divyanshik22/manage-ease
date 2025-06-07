import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
  Chip,
  Avatar,
  Tooltip,
  Fade
} from '@mui/material';
import { 
  Brush as BrushIcon,
  CalendarMonth as CalendarIcon,
  ViewKanban as KanbanIcon,
  ArrowForward as ArrowIcon,
  Star as StarIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      title: 'Whiteboard',
      description: 'Collaborative drawing and brainstorming space with real-time updates and sharing capabilities.',
      icon: BrushIcon,
      gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      feature: 'whiteboard',
      stats: {
        users: '1.2k',
        rating: '4.8',
        speed: 'Fast'
      }
    },
    {
      title: 'Calendar Manager',
      description: 'Smart calendar system with event scheduling, reminders, and team coordination features.',
      icon: CalendarIcon,
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
      feature: 'calendar',
      stats: {
        users: '2.5k',
        rating: '4.9',
        speed: 'Instant'
      }
    },
    {
      title: 'Kanban Board',
      description: 'Visual task management with drag-and-drop interface, progress tracking, and team collaboration.',
      icon: KanbanIcon,
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
      feature: 'kanban',
      stats: {
        users: '3.1k',
        rating: '4.7',
        speed: 'Fast'
      }
    }
  ];

  const handleFeatureClick = (feature) => {
    switch (feature) {
      case 'whiteboard':
        navigate('/whiteboard');
        break;
      case 'calendar':
        console.log('Calendar feature coming soon!');
        break;
      case 'kanban':
        console.log('Kanban feature coming soon!');
        break;
      default:
        break;
    }
  };

  const FeatureCard = ({ title, description, icon: Icon, gradient, feature, stats, index }) => (
    <MotionCard
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        cursor: 'pointer',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: gradient,
          borderRadius: 'inherit',
          zIndex: 0,
          transition: 'opacity 0.3s ease-in-out',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
          borderRadius: 'inherit',
          zIndex: 1,
          transition: 'opacity 0.3s ease-in-out',
        }
      }}
      onMouseEnter={() => setHoveredCard(feature)}
      onMouseLeave={() => setHoveredCard(null)}
      onClick={() => handleFeatureClick(feature)}
    >
      <CardContent sx={{ 
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        color: 'white'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2
        }}>
          <Box sx={{ 
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            transform: hoveredCard === feature ? 'scale(1.1)' : 'scale(1)',
          }}>
            <Icon sx={{ fontSize: 28 }} />
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Add to favorites">
              <IconButton size="small" sx={{ color: 'white' }}>
                <StarIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton size="small" sx={{ color: 'white' }}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="More options">
              <IconButton size="small" sx={{ color: 'white' }}>
                <MoreIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Typography variant="h5" sx={{ 
          fontWeight: 600,
          mb: 1,
          transition: 'transform 0.3s ease',
          transform: hoveredCard === feature ? 'translateY(-4px)' : 'none'
        }}>
          {title}
        </Typography>

        <Typography variant="body2" sx={{ 
          mb: 3,
          opacity: 0.9,
          flexGrow: 1,
          minHeight: '3em'
        }}>
          {description}
        </Typography>

        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 'auto'
        }}>
          <Stack direction="row" spacing={1}>
            <Chip
              icon={<GroupIcon sx={{ fontSize: 16 }} />}
              label={stats.users}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            <Chip
              icon={<StarIcon sx={{ fontSize: 16 }} />}
              label={stats.rating}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            <Chip
              icon={<SpeedIcon sx={{ fontSize: 16 }} />}
              label={stats.speed}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Stack>
          <Button
            variant="contained"
            endIcon={<ArrowIcon />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
              transition: 'all 0.3s ease',
              transform: hoveredCard === feature ? 'translateX(4px)' : 'none'
            }}
          >
            Explore
          </Button>
        </Box>
      </CardContent>
    </MotionCard>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Welcome to ManageEase
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
          >
            Your all-in-one workspace for seamless collaboration and productivity
          </Typography>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <TrendingUpIcon />
            </Avatar>
            <Typography variant="body1" color="text.secondary">
              <strong>Pro Tip:</strong> Use keyboard shortcuts for faster navigation
            </Typography>
          </Paper>
        </Box>

        {/* Feature Cards */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          mb: 6
        }}>
          {features.map((feature, index) => (
            <Box
              key={feature.title}
              sx={{
                flex: { md: 1 },
                minWidth: { md: 0 },
                maxWidth: { md: '33.33%' }
              }}
            >
              <FeatureCard {...feature} index={index} />
            </Box>
          ))}
        </Box>

        {/* Quick Stats */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Platform Statistics
          </Typography>
          <Grid container spacing={3}>
            {[
              { label: 'Active Users', value: '7.2k', icon: GroupIcon, color: '#2196F3' },
              { label: 'Total Boards', value: '1.5k', icon: KanbanIcon, color: '#9C27B0' },
              { label: 'Tasks Completed', value: '12.8k', icon: CalendarIcon, color: '#4CAF50' }
            ].map((stat) => (
              <Grid item xs={12} sm={4} key={stat.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color }}>
                    <stat.icon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 