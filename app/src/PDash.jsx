// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const PDash = () => {
//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     location: '',
//     image: null,
//   });

//   const [questions, setQuestions] = useState([]);
//   const [editId, setEditId] = useState(null);

//   const token = localStorage.getItem('token');

//   // Fetch all questions
//   const fetchQuestions = async () => {
//     if (!token) return; // prevent request if no token
//     try {
//       const res = await axios.get('http://localhost:5000/api/questions', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setQuestions(res.data);
//     } catch (err) {
//       console.error(err);
//       alert('Error fetching questions. Please login again.');
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, []);

//   // Submit or update question
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       alert('Please login first!');
//       return;
//     }

//     const data = new FormData();
//     data.append('title', form.title);
//     data.append('description', form.description);
//     data.append('location', form.location);
//     if (form.image) data.append('image', form.image);

//     try {
//       if (editId) {
//         await axios.put(`http://localhost:5000/api/questions/${editId}`, data, {
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
//         });
//         setEditId(null);
//       } else {
//         await axios.post('http://localhost:5000/api/questions', data, {
//           headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
//         });
//       }
//       setForm({ title: '', description: '', location: '', image: null });
//       fetchQuestions();
//       alert('Question submitted successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('Error submitting question');
//     }
//   };

//   // Edit question
//   const handleEdit = (q) => {
//     setForm({
//       title: q.title,
//       description: q.description,
//       location: q.location,
//       image: null,
//     });
//     setEditId(q._id);
//   };

//   // Delete question
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/questions/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchQuestions();
//     } catch (err) {
//       console.error(err);
//       alert('Error deleting question');
//     }
//   };

//   return (
//     <div className="p-6 text-white min-h-screen bg-gray-900">
//       {/* Header */}
//       <div className="flex justify-between mb-6 items-center">
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//         <div className="flex gap-4">
//           <Link to="/common" className="text-blue-400 hover:underline">
//             View All Questions
//           </Link>
//           <button
//             className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
//             onClick={() => {
//               localStorage.removeItem('token');
//               window.location.href = '/login';
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="mb-6 space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg"
//       >
//         <input
//           className="w-full p-3 bg-gray-700 rounded text-white"
//           placeholder="Question Title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           required
//         />

//         <textarea
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//           className="w-full p-3 bg-gray-700 rounded text-white"
//           placeholder="Description"
//           rows="4"
//           required
//         />

//         <input
//           className="w-full p-3 bg-gray-700 rounded text-white"
//           placeholder="Location"
//           value={form.location}
//           onChange={(e) => setForm({ ...form, location: e.target.value })}
//           required
//         />

//         <input
//           type="file"
//           className="w-full p-3 bg-gray-700 rounded text-white"
//           accept="image/*"
//           onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
//         />

//         <button
//           type="submit"
//           className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded font-semibold"
//         >
//           {editId ? 'Update Question' : 'Post Question'}
//         </button>
//       </form>

//       {/* Questions List */}
//       <div className="space-y-4">
//         {questions.map((q) => (
//           <div key={q._id} className="bg-gray-800 p-4 rounded shadow-md">
//             <h2 className="text-xl font-bold">{q.title}</h2>
//             <p className="text-gray-300 mt-1">{q.description}</p>
//             <p className="text-gray-400 text-sm mt-1">Location: {q.location}</p>
//             {q.image && (
//               <img
//                 src={q.image}
//                 alt={q.title}
//                 className="w-full max-h-60 object-cover rounded mt-2"
//               />
//             )}
//             <p className="text-xs text-gray-500 mt-2">
//               {new Date(q.createdAt).toLocaleString()}
//             </p>
//             <div className="flex gap-2 mt-2">
//               <button
//                 onClick={() => handleEdit(q)}
//                 className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(q._id)}
//                 className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PDash;



// PDash.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';

const PDash = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    image: null,
  });

  const [questions, setQuestions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({}); // per answer key qId-ansId

  const token = localStorage.getItem('token');

  // Fetch all questions for this user
  const fetchQuestions = async () => {
    if (!token) return; // prevent request if no token
    try {
      const res = await axios.get('https://crowdsolve-m96y.onrender.com/api/questions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching questions. Please login again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line
  }, []);

  // Submit or update question
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login first!');
      return;
    }

    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('location', form.location);
    if (form.image) data.append('image', form.image);

    try {
      if (editId) {
        await axios.put(`https://crowdsolve-m96y.onrender.com/api/questions/${editId}`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setEditId(null);
      } else {
        await axios.post('https://crowdsolve-m96y.onrender.com/api/questions', data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      }
      setForm({ title: '', description: '', location: '', image: null });
      fetchQuestions();
      alert('Question submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Error submitting question');
    }
  };

  // Edit question
  const handleEdit = (q) => {
    setForm({
      title: q.title,
      description: q.description,
      location: q.location,
      image: null,
    });
    setEditId(q._id);
  };

  // Delete question
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await axios.delete(`https://crowdsolve-m96y.onrender.com/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert('Error deleting question');
    }
  };

  // Like/unlike an answer (dashboard)
  const handleLikeAnswer = async (qId, ansId) => {
    try {
      await axios.post(
        `https://crowdsolve-m96y.onrender.com/api/questions/${qId}/answers/${ansId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchQuestions();
    } catch (err) {
      console.error('Error liking answer', err);
    }
  };

  // Add comment to an answer (dashboard)
  const handleAddComment = async (qId, ansId) => {
    const key = `${qId}-${ansId}`;
    const text = (commentInputs[key] || '').trim();
    if (!text) return;
    try {
      await axios.post(
        `https://crowdsolve-m96y.onrender.com/api/questions/${qId}/answers/${ansId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentInputs((p) => ({ ...p, [key]: '' }));
      fetchQuestions();
    } catch (err) {
      console.error('Error adding comment', err);
    }
  };

  return (
    <div className="p-6 pt-20 text-white min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      {/* Header */}
      {/* <div className="fixed top-0 left-0 w-full z-50 p-4 flex items-center justify-between bg-opacity-20 backdrop-blur-sm bg-gradient-to-t from-[#020617] via-[#0f172a] to-[#1e293b] border-b border-gray-700">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/common" className="text-blue-300 hover:underline">View All Questions</Link>
          <button
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
      </div> */}
<div className="fixed top-0 left-0 w-full z-50 p-4 flex items-center justify-between bg-opacity-20 backdrop-blur-sm bg-gradient-to-t from-[#020617] via-[#0f172a] to-[#1e293b] border-b border-gray-700">
  <h1 className="text-3xl font-extrabold  text-white tracking-wide">Dashboard</h1>

  <div className="flex items-center gap-6">
    <Link
      to="/common"
      className="relative inline-block text-sm font-medium text-white hover:text-violet-300 transition-colors duration-300
      after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-purple-400 after:to-violet-400
      hover:after:w-full after:transition-all after:duration-300 after:rounded-full"
    >
      Home
    </Link>

    <button
      onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }}
      className="px-6 py-2 rounded-full text-gray-100 font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-violet-400 border border-violet-600 hover:scale-105 hover:opacity-90 shadow-md hover:shadow-lg transition-transform duration-300"
    >
      Logout
    </button>
  </div>
</div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <input
          className="w-full p-3 bg-gray-700 rounded text-white"
          placeholder="Question Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 bg-gray-700 rounded text-white"
          placeholder="Description"
          rows="4"
          required
        />

        <input
          className="w-full p-3 bg-gray-700 rounded text-white"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        <input
          type="file"
          className="w-full p-3 bg-gray-700 rounded text-white"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />

        <button
          type="submit"
          className=" px-4 py-2 rounded-full text-gray-100 font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-violet-400 border border-violet-600 hover:scale-105 hover:opacity-90 shadow-md hover:shadow-lg transition-transform duration-300"
        >
          {editId ? 'Update Question' : 'Post Question'}
        </button>
      </form>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q._id} className="bg-gray-800 p-4 rounded shadow-md max-w-4xl mx-auto">
            <h2 className="text-xl font-bold">{q.title}</h2>
            <p className="text-gray-300 mt-1">{q.description}</p>
            <p className="text-gray-400 text-sm mt-1">Location: {q.location}</p>
            {/* {q.image && (
              <img
                src={q.image}
                alt={q.title}
                className="w-full max-h-60 object-cover rounded mt-2"
              />
            )} */}
            {q.image && (
  <img
    src={`https://crowdsolve-m96y.onrender.com${q.image}`}
    alt={q.title}
    className="w-full max-h-60 object-cover rounded mt-2"
  />
)}

            <p className="text-xs text-gray-500 mt-2">{new Date(q.createdAt).toLocaleString()}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(q)}
                className="px-4 py-1 rounded-full text-gray-100 font-semibold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 border border-green-600 hover:scale-105 hover:opacity-90 shadow-md hover:shadow-lg transition-transform duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(q._id)}
                className="px-3 py-1 rounded-full text-gray-100 font-semibold bg-red-500 hover:scale-105 hover:opacity-90 shadow-md hover:shadow-lg transition-transform duration-300"
              >
                Delete
              </button>
            </div>

            {/* Answers */}
            <div className="mt-4 space-y-3">
              <h3 className="text-lg font-semibold text-white">Answers</h3>
              {q.answers.length === 0 && <div className="text-gray-400 italic">No answers yet</div>}
              {q.answers.map((ans) => {
                const key = `${q._id}-${ans._id}`;
                return (
                  <div key={ans._id} className="bg-gray-700 p-3 rounded">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-gray-200">{ans.answer}</div>
                        <div className="text-xs text-gray-400 mt-1">By {ans.user?.username || 'Unknown'} • {new Date(ans.createdAt).toLocaleString()}</div>

                        {/* comments */}
                        <div className="mt-2 space-y-1">
                          {ans.comments && ans.comments.length > 0 && (
                            <>
                              <div className="text-sm font-medium text-white">Comments</div>
                              {ans.comments.map((c, i) => (
                                <div key={i} className="text-sm text-gray-300 bg-gray-800 p-2 rounded">
                                  <div className="text-xs text-gray-400"> {c.user?.username || 'Unknown'} • {new Date(c.createdAt).toLocaleString()}</div>
                                  <div>{c.text}</div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>

                        <div className="mt-3 flex gap-2">
                          <input
                            placeholder="Add comment..."
                            className="flex-1 p-2 bg-gray-900 rounded text-gray-200 border border-gray-600"
                            value={commentInputs[key] || ''}
                            onChange={(e) => setCommentInputs((p) => ({ ...p, [key]: e.target.value }))}
                          />
                          <button onClick={() => handleAddComment(q._id, ans._id)} className="px-4 py-2 rounded-full text-gray-100 font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-violet-400 border border-violet-600 hover:scale-105 hover:opacity-90 shadow-md hover:shadow-lg transition-transform duration-300 ">Comment</button>
                        </div>
                      </div>

                      <div className="flex flex-col items-center ml-4">
                        <button onClick={() => handleLikeAnswer(q._id, ans._id)} className="p-2 rounded-full transform hover:scale-105 transition">
                          <FaHeart className={`w-6 h-6 ${ans.likes && ans.likes.length > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                        </button>
                        <div className="text-sm text-gray-300 mt-1">{ans.likes ? ans.likes.length : 0}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PDash;
