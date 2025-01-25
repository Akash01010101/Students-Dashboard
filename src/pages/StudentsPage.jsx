import { useState, useEffect } from "react";
import { db } from "../firebase.js";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  Grid,
  Paper,
  Container,
  TableContainer,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  Add as AddIcon, 
  Visibility as ViewIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    section: "",
    rollNumber: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    guardianName: "",
    enrollmentDate: "",
    isActive: false,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "students"));
      setStudents(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchStudents();
  }, []);

  const renderStudentDetailsModal = () => (
    <Modal open={viewOpen} onClose={handleViewClose}>
      <Box sx={{ 
        position: "absolute", 
        top: "50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)", 
        bgcolor: "background.paper", 
        boxShadow: 24,
        p: 4, 
        borderRadius: 2, 
        width: "90%",  // Make modal responsive by using percentage width
        maxWidth: "500px",
        maxHeight: "90vh",
        overflowY: "auto"
      }}>
        {selectedStudent && (
          <>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
              Student Profile
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "Name", value: selectedStudent.name },
                { label: "ID", value: selectedStudent.id },
                { label: "Class", value: selectedStudent.class },
                { label: "Section", value: selectedStudent.section },
                { label: "Roll Number", value: selectedStudent.rollNumber },
                { label: "Age", value: selectedStudent.age },
                { label: "Gender", value: selectedStudent.gender },
                { label: "Phone", value: selectedStudent.phone },
                { label: "Email", value: selectedStudent.email },
                { label: "Guardian Name", value: selectedStudent.guardianName },
                { label: "Enrollment Date", value: selectedStudent.enrollmentDate },
                { label: "Active Status", value: selectedStudent.isActive ? 'Active' : 'Inactive' }
              ].map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>  {/* Added responsiveness */}
                  <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
                  <Typography variant="body1">{item.value}</Typography>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleViewClose}
              >
                Close
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );

  const validateForm = () => {
    const newErrors = {};
    // Validation logic...
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpen = (student = null) => {
    if (student) {
      setNewStudent(student);
      setEditingId(student.id);
    } else {
      setNewStudent({
        name: "",
        class: "",
        section: "",
        rollNumber: "",
        age: "",
        gender: "",
        address: "",
        phone: "",
        email: "",
        guardianName: "",
        enrollmentDate: "",
        isActive: false,
      });
      setEditingId(null);
    }
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleViewOpen = (student) => {
    setSelectedStudent(student);
    setViewOpen(true);
  };
  const handleViewClose = () => setViewOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStudent({ ...newStudent, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) {
      const newErrorState = {...errors};
      delete newErrorState[name];
      setErrors(newErrorState);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        if (editingId) {
          await updateDoc(doc(db, "students", editingId), newStudent);
          setStudents(students.map((s) => (s.id === editingId ? { id: editingId, ...newStudent } : s)));
        } else {
          const docRef = await addDoc(collection(db, "students"), newStudent);
          setStudents([...students, { id: docRef.id, ...newStudent }]);
        }
        handleClose();
      } catch (error) {
        console.error("Error submitting student data:", error);
        alert("Failed to submit student data. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "students", id));
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Student Management</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Student
          </Button>
        </Box>

        <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                {["ID", "Name", "Class", "Section", "Roll Number", "Actions"].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton color="primary" onClick={() => handleViewOpen(student)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton color="secondary" onClick={() => handleOpen(student)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(student.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {renderStudentDetailsModal()}

      {/* Add/Edit Modal remains the same as previous implementation */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "white", p: 4, borderRadius: 2, maxWidth: "500px", width: "100%" }}>
        <h2>{editingId ? "Edit Student" : "Add Student"}</h2>
          <TextField 
            label="Name" 
            name="name" 
            fullWidth 
            margin="dense" 
            onChange={handleChange} 
            value={newStudent.name}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField 
            label="Class" 
            name="class" 
            fullWidth 
            margin="dense" 
            onChange={handleChange} 
            value={newStudent.class}
            error={!!errors.class}
            helperText={errors.class}
          />
          <TextField 
            label="Section" 
            name="section" 
            fullWidth 
            margin="dense" 
            onChange={handleChange} 
            value={newStudent.section}
            error={!!errors.section}
            helperText={errors.section}
          />
          <TextField 
            label="Roll Number" 
            name="rollNumber" 
            fullWidth 
            margin="dense" 
            onChange={handleChange} 
            value={newStudent.rollNumber}
            error={!!errors.rollNumber}
            helperText={errors.rollNumber}
          />
          <TextField 
            label="Age" 
            name="age" 
            fullWidth 
            margin="dense" 
            onChange={handleChange} 
            value={newStudent.age}
            error={!!errors.age}
            helperText={errors.age}
          />
          <FormControl fullWidth margin="dense" error={!!errors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select 
              name="gender" 
              value={newStudent.gender} 
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {errors.gender && <Typography color="error" variant="caption">{errors.gender}</Typography>}
          </FormControl>
          <TextField 
            label="Address" 
            name="address" 
            fullWidth 
            margin="dense" 
            onChange={handleChange} 
            value={newStudent.address}
            error={!!errors.address}
            helperText={errors.address}
          />
          <TextField 
            label="Phone" 
            name="phone" 
            fullWidth 
            margin="dense" 
            onChange={handleChange} 
            value={newStudent.phone}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField 
            label="Email" 
            name="email" 
            fullWidth 
            margin="dense" 
            onChange={handleChange} 
            value={newStudent.email}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField 
            label="Guardian Name" 
            name="guardianName" 
            fullWidth 
            margin="dense" 
            onChange={handleChange} 
            value={newStudent.guardianName}
            error={!!errors.guardianName}
            helperText={errors.guardianName}
          />
          <TextField 
            label="Enrollment Date" 
            name="enrollmentDate" 
            type="date" 
            fullWidth 
            margin="dense" 
            onChange={handleChange} 
            value={newStudent.enrollmentDate}
            InputLabelProps={{ shrink: true }}
            error={!!errors.enrollmentDate}
            helperText={errors.enrollmentDate}
          />
          <FormControlLabel 
            control={
              <Checkbox 
                name="isActive" 
                checked={newStudent.isActive} 
                onChange={handleChange} 
              />
            } 
            label="Active" 
          />
          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Submit</Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default StudentsPage;
