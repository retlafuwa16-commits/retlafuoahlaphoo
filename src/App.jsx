
import { useEffect, useState } from "react";
import "./App.css";

const initialStudents = [
  {
    id: "ST001",
    fullName: "Thabo Mokoena",
    age: 21,
    email: "thabo@example.com",
    course: "Information Technology",
    status: "Active",
  },
  {
    id: "ST002",
    fullName: "Lerato Khumalo",
    age: 22,
    email: "lerato@example.com",
    course: "Business Information Technology",
    status: "Active",
  },
  {
    id: "ST003",
    fullName: "Palesa Ndlovu",
    age: 20,
    email: "palesa@example.com",
    course: "Software Development",
    status: "Inactive",
  },
];

const emptyForm = {
  fullName: "",
  age: "",
  email: "",
  course: "",
  status: "Active",
};

function StudentModal({ student, onSave, onClose }) {
  const [form, setForm] = useState(
    student
      ? { ...student, age: String(student.age) }
      : { ...emptyForm }
  );

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    const age = Number(form.age);

    if (
      form.age.trim() === "" ||
      !Number.isFinite(age) ||
      !Number.isInteger(age) ||
      age < 16 ||
      age > 100
    ) {
      newErrors.age = "Enter a whole-number age from 16 to 100.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.course.trim()) {
      newErrors.course = "Course of study is required.";
    }

    if (!["Active", "Inactive"].includes(form.status)) {
      newErrors.status = "Select a valid enrollment status.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onSave({
      ...form,
      fullName: form.fullName.trim(),
      age,
      email: form.email.trim(),
      course: form.course.trim(),
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-modal-title"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">
              STUDENT MANAGEMENT
            </p>
            <h2 id="student-modal-title">
              {student ? "Edit student" : "Add new student"}
            </h2>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
          />
          {errors.fullName && (
            <p className="error">{errors.fullName}</p>
          )}

          <div className="form-row">
            <div>
              <label htmlFor="age">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                min="16"
                max="100"
                value={form.age}
                onChange={handleChange}
                placeholder="Age"
              />
              {errors.age && (
                <p className="error">{errors.age}</p>
              )}
            </div>

            <div>
              <label htmlFor="status">Enrollment status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="error">{errors.status}</p>
              )}
            </div>
          </div>

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="student@example.com"
          />
          {errors.email && (
            <p className="error">{errors.email}</p>
          )}

          <label htmlFor="course">Course of study</label>
          <input
            id="course"
            name="course"
            value={form.course}
            onChange={handleChange}
            placeholder="Enter course"
          />
          {errors.course && (
            <p className="error">{errors.course}</p>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="button button-light"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="button button-primary">
              {student ? "Save changes" : "Add student"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DeleteModal({ student, onConfirm, onClose }) {
  if (!student) return null;

  return (
    <div className="modal-backdrop">
      <section
        className="modal delete-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <div className="delete-icon">!</div>

        <h2 id="delete-title">Delete student?</h2>

        <p>
          Are you sure you want to delete{" "}
          <strong>{student.fullName}</strong>?
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button
            className="button button-light"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="button button-danger"
            onClick={onConfirm}
          >
            Delete student
          </button>
        </div>
      </section>
    </div>
  );
}

function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">♧</div>
        <h3>No students found</h3>
        <p>Add a student to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>STUDENT</th>
            <th>STUDENT ID</th>
            <th>AGE</th>
            <th>COURSE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <div className="student-cell">
                  <div className="avatar">
                    {student.fullName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>{student.fullName}</strong>
                    <span className="student-email">
                      {student.email}
                    </span>
                  </div>
                </div>
              </td>

              <td className="student-id">{student.id}</td>
              <td>{student.age}</td>
              <td>{student.course}</td>

              <td>
                <span
                  className={`status ${
                    student.status === "Active"
                      ? "status-active"
                      : "status-inactive"
                  }`}
                >
                  {student.status}
                </span>
              </td>

              <td>
                <div className="row-actions">
                  <button
                    className="icon-button edit-button"
                    onClick={() => onEdit(student)}
                    aria-label={`Edit ${student.fullName}`}
                    title="Edit student"
                  >
                    ✎
                  </button>

                  <button
                    className="icon-button delete-button"
                    onClick={() => onDelete(student)}
                    aria-label={`Delete ${student.fullName}`}
                    title="Delete student"
                  >
                    ×
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("diwa2110-students");
      return saved === null ? initialStudents : JSON.parse(saved);
    } catch {
      return initialStudents;
    }
  });

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "diwa2110-students",
      JSON.stringify(students)
    );
  }, [students]);

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();

    return (
      student.fullName.toLowerCase().includes(query) ||
      student.id.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query)
    );
  });

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  function handleSave(formData) {
    if (selectedStudent) {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === selectedStudent.id
            ? { ...student, ...formData }
            : student
        )
      );
    } else {
     const nextNumber =
  students.reduce((maximum, student) => {
    const number = Number(student.id.replace("ST", ""));

    return Number.isFinite(number)
      ? Math.max(maximum, number)
      : maximum;
  }, 0) + 1;

const newStudent = {
  ...formData,
  id: `ST${String(nextNumber).padStart(3, "0")}`,
};

      setStudents((previous) => [...previous, newStudent]);
    }

    closeStudentModal();
  }

  function openAddModal() {
    setSelectedStudent(null);
    setModalOpen(true);
  }

  function openEditModal(student) {
    setSelectedStudent(student);
    setModalOpen(true);
  }

  function closeStudentModal() {
    setModalOpen(false);
    setSelectedStudent(null);
  }

  function confirmDelete() {
    if (!studentToDelete) return;

    setStudents((previous) =>
      previous.filter(
        (student) => student.id !== studentToDelete.id
      )
    );

    setStudentToDelete(null);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">S</div>
          <div>
            <strong>StudentHub</strong>
            <span>MANAGEMENT SYSTEM</span>
          </div>
        </div>

        <p className="sidebar-label">WORKSPACE</p>

        <div className="nav-item nav-active">
          <span>▦</span>
          Student Dashboard
        </div>

        <div className="sidebar-footer">
          <div className="profile-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <span>System manager</span>
          </div>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <span>Dashboard / Students</span>
          <span className="online-indicator">● System ready</span>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>Student Dashboard</h1>
              <p className="subtitle">
                Manage student records in one place.
              </p>
            </div>

            <button
              className="button button-primary"
              onClick={openAddModal}
            >
              <span>＋</span> Add student
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span>Total students</span>
                <span className="stat-icon">♙</span>
              </div>
              <strong>{students.length}</strong>
              <p>All registered students</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Active students</span>
                <span className="stat-icon green-icon">✓</span>
              </div>
              <strong>{activeCount}</strong>
              <p>Currently active</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Inactive students</span>
                <span className="stat-icon orange-icon">◷</span>
              </div>
              <strong>{students.length - activeCount}</strong>
              <p>Currently inactive</p>
            </div>
          </div>

          <section className="content-card">
            <div className="table-heading">
              <div>
                <h2>All students</h2>
                <p>View and manage your student records.</p>
              </div>

              <input
                className="search-input"
                type="search"
                placeholder="Search students..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search students"
              />
            </div>

            <StudentTable
              students={filteredStudents}
              onEdit={openEditModal}
              onDelete={setStudentToDelete}
            />

            <div className="table-footer">
              Showing {filteredStudents.length} of {students.length} students
            </div>
          </section>

          <p className="page-footer">
            DIWA2110 · Web Application Development
          </p>
        </div>
      </section>

      {modalOpen && (
        <StudentModal
          key={selectedStudent?.id ?? "new-student"}
          student={selectedStudent}
          onSave={handleSave}
          onClose={closeStudentModal}
        />
      )}

      {studentToDelete && (
        <DeleteModal
          student={studentToDelete}
          onConfirm={confirmDelete}
          onClose={() => setStudentToDelete(null)}
        />
      )}
    </main>
  );
}

export default App;
