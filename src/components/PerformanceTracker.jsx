import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Autocomplete,
  LinearProgress,
  Tooltip,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Collapse,
  useTheme,
  useMediaQuery,
  Stack,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Psychology as PsychologyIcon,
  AddCircle as AddCircleIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Predefined topics for different categories
const TOPICS = {
  coding: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS', 'HTML', 'Next.js', 'Redux', 'GraphQL'],
  dsa: ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching'],
  job: ['Resume', 'Interview Prep', 'Networking', 'Portfolio', 'LinkedIn', 'GitHub'],
  other: ['Learning', 'Research', 'Planning', 'Review']
};

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

const CustomFieldDialog = ({ open, onClose, onAdd, existingFields }) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!fieldName.trim()) {
      setError('Field name is required');
      return;
    }
    if (existingFields.includes(fieldName.toLowerCase())) {
      setError('Field name already exists');
      return;
    }
    onAdd({ name: fieldName, type: fieldType });
    setFieldName('');
    setFieldType('text');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Custom Field</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Field Name"
            value={fieldName}
            onChange={(e) => {
              setFieldName(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error}
          />
          <FormControl fullWidth>
            <InputLabel>Field Type</InputLabel>
            <Select
              value={fieldType}
              label="Field Type"
              onChange={(e) => setFieldType(e.target.value)}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="select">Select</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Add Field</Button>
      </DialogActions>
    </Dialog>
  );
};

const EntryDetailDialog = ({ open, onClose, entry, onSave, onDelete }) => {
  const [editedEntry, setEditedEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (entry) {
      setEditedEntry(entry);
      setIsEditing(false);
    }
  }, [entry]);

  // If entry is null, don't render the dialog content
  if (!entry || !editedEntry) {
    return null;
  }

  const handleSave = () => {
    onSave(editedEntry);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEntry(entry);
    setIsEditing(false);
  };

  const calculateProgress = (achieved, set) => {
    const achievedNum = parseFloat(achieved) || 0;
    const setNum = parseFloat(set) || 0;
    if (setNum === 0) return 0;
    return Math.min(100, (achievedNum / setNum) * 100);
  };

  const renderField = (field, value) => {
    if (isEditing) {
      switch (field.type) {
        case 'number':
          return (
            <TextField
              fullWidth
              type="number"
              label={field.name}
              value={value || ''}
              onChange={(e) => setEditedEntry({ ...editedEntry, [field.name]: e.target.value })}
            />
          );
        case 'select':
          return (
            <FormControl fullWidth>
              <InputLabel>{field.name}</InputLabel>
              <Select
                value={value || ''}
                label={field.name}
                onChange={(e) => setEditedEntry({ ...editedEntry, [field.name]: e.target.value })}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
              </Select>
            </FormControl>
          );
        case 'date':
          return (
            <TextField
              fullWidth
              type="date"
              label={field.name}
              value={value || ''}
              onChange={(e) => setEditedEntry({ ...editedEntry, [field.name]: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          );
        default:
          return (
            <TextField
              fullWidth
              label={field.name}
              value={value || ''}
              onChange={(e) => setEditedEntry({ ...editedEntry, [field.name]: e.target.value })}
              multiline={field.name === 'notes' || field.name === 'resources'}
              rows={field.name === 'notes' || field.name === 'resources' ? 3 : 1}
            />
          );
      }
    }

    return (
      <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
        {value || '-'}
      </Typography>
    );
  };

  return (
    <Dialog 
      open={open && !!entry} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '60vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Entry Details - {entry.date}
          </Typography>
          <Stack direction="row" spacing={1}>
            {!isEditing ? (
              <>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  variant="outlined"
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    onDelete(entry.id);
                    onClose();
                  }}
                  color="error"
                  variant="outlined"
                >
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleCancel} variant="outlined">
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                  Save
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Basic Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">Date</Typography>
            {renderField({ type: 'date' }, editedEntry.date)}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">Category</Typography>
            {isEditing ? (
              <FormControl fullWidth>
                <Select
                  value={editedEntry.category}
                  onChange={(e) => setEditedEntry({ ...editedEntry, category: e.target.value })}
                >
                  <MenuItem value="coding">Coding</MenuItem>
                  <MenuItem value="dsa">DSA</MenuItem>
                  <MenuItem value="job">Job Search</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Chip
                icon={getCategoryIcon(editedEntry.category)}
                label={editedEntry.category}
                size="small"
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">Topics</Typography>
            {isEditing ? (
              <Autocomplete
                multiple
                options={TOPICS[editedEntry.category]}
                value={editedEntry.topics}
                onChange={(_, newValue) => setEditedEntry({ ...editedEntry, topics: newValue })}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select topics" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      icon={getCategoryIcon(editedEntry.category)}
                      size="small"
                    />
                  ))
                }
              />
            ) : (
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {editedEntry.topics.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    size="small"
                    icon={getCategoryIcon(editedEntry.category)}
                  />
                ))}
              </Stack>
            )}
          </Grid>

          {/* Goals and Progress */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 2 }}>
              Goals and Progress
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Goals Set</Typography>
            {renderField({ type: 'text' }, editedEntry.goalsSet)}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">Goals Achieved</Typography>
            {renderField({ type: 'text' }, editedEntry.goalsAchieved)}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Progress</Typography>
            <LinearProgress
              variant="determinate"
              value={calculateProgress(editedEntry.goalsAchieved, editedEntry.goalsSet)}
              color="primary"
              sx={{ mt: 1 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {`${parseFloat(editedEntry.goalsAchieved) || 0} / ${parseFloat(editedEntry.goalsSet) || 0} goals achieved`}
            </Typography>
          </Grid>

          {/* Metrics */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 2 }}>
              Metrics
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">Hours Focused</Typography>
            {renderField({ type: 'number' }, editedEntry.hoursFocused)}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">Difficulty</Typography>
            {isEditing ? (
              <FormControl fullWidth>
                <Select
                  value={editedEntry.difficulty}
                  onChange={(e) => setEditedEntry({ ...editedEntry, difficulty: e.target.value })}
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Chip
                label={editedEntry.difficulty}
                color={getDifficultyColor(editedEntry.difficulty)}
                size="small"
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="text.secondary">Confidence</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                type="number"
                value={editedEntry.confidence}
                onChange={(e) => setEditedEntry({ 
                  ...editedEntry, 
                  confidence: Math.min(10, Math.max(1, e.target.value)) 
                })}
                inputProps={{ min: 1, max: 10 }}
              />
            ) : (
              <Box sx={{ width: '100%' }}>
                <LinearProgress
                  variant="determinate"
                  value={editedEntry.confidence * 10}
                  color="primary"
                />
                <Typography variant="caption" color="text.secondary">
                  {editedEntry.confidence}/10
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 2 }}>
              Additional Information
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Resources Used</Typography>
            {renderField({ type: 'text' }, editedEntry.resources)}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Notes</Typography>
            {renderField({ type: 'text' }, editedEntry.notes)}
          </Grid>

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Custom Fields
                </Typography>
              </Grid>
              {customFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <Typography variant="body2" color="text.secondary">{field.name}</Typography>
                  {renderField(field, editedEntry[field.name])}
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const PerformanceTracker = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [entries, setEntries] = useState(() => {
    // Load entries from localStorage on initial render
    const savedEntries = localStorage.getItem('performance-entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  const [customFields, setCustomFields] = useState(() => {
    const savedFields = localStorage.getItem('custom-fields');
    return savedFields ? JSON.parse(savedFields) : [];
  });

  const [showCustomFields, setShowCustomFields] = useState(false);
  const [customFieldDialogOpen, setCustomFieldDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('performance-entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('custom-fields', JSON.stringify(customFields));
  }, [customFields]);

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'coding',
    topics: [],
    goalsSet: '',
    goalsAchieved: '',
    hoursFocused: '',
    dsaSolved: '',
    projectProgress: '',
    appliedJobs: '',
    difficulty: 'medium', // easy, medium, hard
    confidence: 5, // 1-10 scale
    notes: '',
    resources: '', // books, videos, articles used
    nextSteps: '', // what to focus on next
    ...customFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  });

  const handleAddEntry = () => {
    setEntries([...entries, { ...newEntry, id: Date.now() }]);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      category: 'coding',
      topics: [],
      goalsSet: '',
      goalsAchieved: '',
      hoursFocused: '',
      dsaSolved: '',
      projectProgress: '',
      appliedJobs: '',
      difficulty: 'medium',
      confidence: 5,
      notes: '',
      resources: '',
      nextSteps: '',
      ...customFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
    });
  };

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleAddCustomField = (field) => {
    setCustomFields([...customFields, field]);
    setEntries(entries.map(entry => ({
      ...entry,
      [field.name]: ''
    })));
    setNewEntry(prev => ({
      ...prev,
      [field.name]: ''
    }));
    setSnackbar({
      open: true,
      message: `Added new field: ${field.name}`,
      severity: 'success'
    });
  };

  const handleDeleteCustomField = (fieldName) => {
    setCustomFields(customFields.filter(f => f.name !== fieldName));
    setEntries(entries.map(entry => {
      const { [fieldName]: removed, ...rest } = entry;
      return rest;
    }));
    setNewEntry(prev => {
      const { [fieldName]: removed, ...rest } = prev;
      return rest;
    });
    setSnackbar({
      open: true,
      message: `Removed field: ${fieldName}`,
      severity: 'info'
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'coding': return <CodeIcon />;
      case 'dsa': return <PsychologyIcon />;
      case 'job': return <WorkIcon />;
      default: return <SchoolIcon />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const renderCustomFieldInput = (field) => {
    switch (field.type) {
      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.name}
            value={newEntry[field.name] || ''}
            onChange={(e) => setNewEntry({ ...newEntry, [field.name]: e.target.value })}
          />
        );
      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>{field.name}</InputLabel>
            <Select
              value={newEntry[field.name] || ''}
              label={field.name}
              onChange={(e) => setNewEntry({ ...newEntry, [field.name]: e.target.value })}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
            </Select>
          </FormControl>
        );
      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={field.name}
            value={newEntry[field.name] || ''}
            onChange={(e) => setNewEntry({ ...newEntry, [field.name]: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        );
      default:
        return (
          <TextField
            fullWidth
            label={field.name}
            value={newEntry[field.name] || ''}
            onChange={(e) => setNewEntry({ ...newEntry, [field.name]: e.target.value })}
          />
        );
    }
  };

  const handleEditEntry = (updatedEntry) => {
    setEntries(entries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
    setSnackbar({
      open: true,
      message: 'Entry updated successfully',
      severity: 'success'
    });
  };

  const calculateProgress = (achieved, set) => {
    const achievedNum = parseFloat(achieved) || 0;
    const setNum = parseFloat(set) || 0;
    if (setNum === 0) return 0;
    return Math.min(100, (achievedNum / setNum) * 100);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon color="primary" /> Performance Tracker
        </Typography>
      </motion.div>

      {/* Custom Fields Section */}
      <MotionPaper
        sx={{ p: 2, mb: 3 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Button
            startIcon={showCustomFields ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowCustomFields(!showCustomFields)}
          >
            Custom Fields
          </Button>
          <Button
            startIcon={<AddCircleIcon />}
            onClick={() => setCustomFieldDialogOpen(true)}
            variant="outlined"
          >
            Add Field
          </Button>
        </Stack>
        <Collapse in={showCustomFields}>
          <Grid container spacing={2}>
            {customFields.map((field) => (
              <Grid item xs={12} sm={6} md={4} key={field.name}>
                <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {field.name} ({field.type})
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteCustomField(field.name)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </MotionPaper>

      {/* Add New Entry Form */}
      <MotionPaper 
        sx={{ p: { xs: 1, sm: 2 }, mb: 3 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newEntry.category}
                label="Category"
                onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value, topics: [] })}
              >
                <MenuItem value="coding">Coding</MenuItem>
                <MenuItem value="dsa">DSA</MenuItem>
                <MenuItem value="job">Job Search</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              multiple
              options={TOPICS[newEntry.category]}
              value={newEntry.topics}
              onChange={(_, newValue) => setNewEntry({ ...newEntry, topics: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="Topics" placeholder="Select topics" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    icon={getCategoryIcon(newEntry.category)}
                  />
                ))
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={newEntry.difficulty}
                label="Difficulty"
                onChange={(e) => setNewEntry({ ...newEntry, difficulty: e.target.value })}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Confidence (1-10)"
              value={newEntry.confidence}
              onChange={(e) => setNewEntry({ ...newEntry, confidence: Math.min(10, Math.max(1, e.target.value)) })}
              inputProps={{ min: 1, max: 10 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Goals Set"
              value={newEntry.goalsSet}
              onChange={(e) => setNewEntry({ ...newEntry, goalsSet: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Goals Achieved"
              value={newEntry.goalsAchieved}
              onChange={(e) => setNewEntry({ ...newEntry, goalsAchieved: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Hours Focused"
              type="number"
              value={newEntry.hoursFocused}
              onChange={(e) => setNewEntry({ ...newEntry, hoursFocused: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Resources Used"
              value={newEntry.resources}
              onChange={(e) => setNewEntry({ ...newEntry, resources: e.target.value })}
              placeholder="Books, videos, articles"
            />
          </Grid>
          {/* Custom Fields */}
          {customFields.map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field.name}>
              {renderCustomFieldInput(field)}
            </Grid>
          ))}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddEntry}
              sx={{ height: '100%' }}
            >
              Add Entry
            </Button>
          </Grid>
        </Grid>
      </MotionPaper>

      {/* Entries Table */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        sx={{ overflowX: 'auto' }}
      >
        <TableContainer>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Topics</TableCell>
                <TableCell>Goals</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Confidence</TableCell>
                {!isMobile && <TableCell>Resources</TableCell>}
                {customFields.map(field => (
                  !isMobile && <TableCell key={field.name}>{field.name}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {entries.map((entry) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getCategoryIcon(entry.category)}
                        label={entry.category}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {entry.topics.map((topic) => (
                        <Chip
                          key={topic}
                          label={topic}
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={`${parseFloat(entry.goalsAchieved) || 0}/${parseFloat(entry.goalsSet) || 0} goals achieved`}>
                        <Box sx={{ width: '100%' }}>
                          <LinearProgress
                            variant="determinate"
                            value={calculateProgress(entry.goalsAchieved, entry.goalsSet)}
                            color="primary"
                          />
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{entry.hoursFocused}</TableCell>
                    <TableCell>
                      <Chip
                        label={entry.difficulty}
                        color={getDifficultyColor(entry.difficulty)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={`Confidence: ${entry.confidence}/10`}>
                        <LinearProgress
                          variant="determinate"
                          value={entry.confidence * 10}
                          color="primary"
                        />
                      </Tooltip>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {entry.resources}
                        </Typography>
                      </TableCell>
                    )}
                    {customFields.map(field => (
                      !isMobile && (
                        <TableCell key={field.name}>
                          <Typography variant="body2" noWrap>
                            {entry[field.name]}
                          </Typography>
                        </TableCell>
                      )
                    ))}
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size={isMobile ? "small" : "medium"}
                          onClick={() => {
                            setSelectedEntry(entry);
                            setDetailDialogOpen(true);
                          }}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size={isMobile ? "small" : "medium"}
                          onClick={() => handleDeleteEntry(entry.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </MotionPaper>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} md={3}>
          <MotionCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <CardContent>
              <Typography variant="h6" color="primary">Total Hours Focused</Typography>
              <Typography variant="h4">
                {entries.reduce((sum, entry) => sum + (parseFloat(entry.hoursFocused) || 0), 0)}
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <MotionCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <CardContent>
              <Typography variant="h6" color="primary">Goals Achievement Rate</Typography>
              <Typography variant="h4">
                {entries.length > 0
                  ? Math.round(
                      (entries.reduce((sum, entry) => sum + (parseFloat(entry.goalsAchieved) || 0), 0) /
                        Math.max(1, entries.reduce((sum, entry) => sum + (parseFloat(entry.goalsSet) || 0), 0))) *
                        100
                    )
                  : 0}
                %
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <MotionCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <CardContent>
              <Typography variant="h6" color="primary">Average Confidence</Typography>
              <Typography variant="h4">
                {entries.length > 0
                  ? (entries.reduce((sum, entry) => sum + (parseFloat(entry.confidence) || 0), 0) / entries.length).toFixed(1)
                  : 0}
                /10
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <MotionCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <CardContent>
              <Typography variant="h6" color="primary">Topics Covered</Typography>
              <Typography variant="h4">
                {new Set(entries.flatMap(entry => entry.topics)).size}
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Custom Field Dialog */}
      <CustomFieldDialog
        open={customFieldDialogOpen}
        onClose={() => setCustomFieldDialogOpen(false)}
        onAdd={handleAddCustomField}
        existingFields={customFields.map(f => f.name.toLowerCase())}
      />

      {/* Entry Detail Dialog */}
      {selectedEntry && (
        <EntryDetailDialog
          open={detailDialogOpen}
          onClose={() => {
            setDetailDialogOpen(false);
            setSelectedEntry(null);
          }}
          entry={selectedEntry}
          onSave={handleEditEntry}
          onDelete={handleDeleteEntry}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PerformanceTracker; 