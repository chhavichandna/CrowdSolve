// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';


// const Common = () => {
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [expandedAnswers, setExpandedAnswers] = useState({});
//   const token = localStorage.getItem('token');

//   // Fetch all questions
//   const fetchAllQuestions = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/questions/all', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setQuestions(res.data);
//     } catch (error) {
//       console.error('Error fetching questions', error);
//     }
//   };

//   useEffect(() => {
//     fetchAllQuestions();
//   }, []);

//   // Handle Answer Submit
//   const handleAnswer = async (id) => {
//     if (!answers[id]) return;
//     try {
//       await axios.post(
//         `http://localhost:5000/api/questions/${id}/answer`,
//         { answer: answers[id] },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setAnswers({ ...answers, [id]: '' });
//       fetchAllQuestions();
//     } catch (error) {
//       console.error('Error submitting answer', error);
//     }
//   };

//   // Like/Unlike a question
//   const handleLike = async (id) => {
//     try {
//       await axios.post(
//         `http://localhost:5000/api/questions/${id}/like`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchAllQuestions();
//     } catch (err) {
//       console.error('Error liking question', err);
//     }
//   };

//   // Expand/collapse long answers
//   const toggleExpand = (qId, ansIdx) => {
//     const key = `${qId}-${ansIdx}`;
//     setExpandedAnswers((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const renderAnswerText = (answer, qId, ansIdx) => {
//     const key = `${qId}-${ansIdx}`;
//     const maxLength = 150;
//     if (answer.length <= maxLength) return answer;

//     if (expandedAnswers[key]) {
//       return (
//         <>
//           {answer}{' '}
//           <button
//             className="text-blue-400 hover:underline"
//             onClick={() => toggleExpand(qId, ansIdx)}
//           >
//             Read Less
//           </button>
//         </>
//       );
//     }

//     return (
//       <>
//         {answer.slice(0, maxLength)}...{' '}
//         <button
//           className="text-blue-400 hover:underline"
//           onClick={() => toggleExpand(qId, ansIdx)}
//         >
//           Read More
//         </button>
//       </>
//     );
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-900 text-gray-200">
//       {/* Sidebar */}
//       <aside className="w-1/4 bg-gray-800 shadow-lg p-6 overflow-y-auto border-r border-gray-700">
//         <h2 className="text-xl font-bold mb-4 text-white">Questions</h2>
//         <ul>
//           {questions.map((q) => (
//             <li
//               key={q._id}
//               className="hover:text-blue-400 cursor-pointer truncate"
//               title={q.title}
//             >
//               {q.title.length > 40 ? q.title.slice(0, 37) + '...' : q.title}
//             </li>
//           ))}
//         </ul>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 p-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-white">All Questions</h1>
//           <div className="flex gap-4">
//             <Link to="/dash" className="text-blue-400">
//               Dashboard
//             </Link>
//             <button
//               className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
//               onClick={() => {
//                 localStorage.removeItem('token');
//                 window.location.href = '/login';
//               }}
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         <div className="space-y-10">
//           {questions.map((q) => (
//             <div
//               key={q._id}
//               className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700"
//             >
//               <h2 className="text-2xl font-bold mb-2 text-white">{q.title}</h2>
//               <p className="text-gray-300 mb-1">{q.description}</p>
//               <p className="text-gray-400 text-sm mb-2">
//                 Location: {q.location || 'Not specified'}
//               </p>

//               {q.image && (
//                <img
//                src={q.image}
//                alt={q.title}
//                className="w-full max-h-60 object-cover rounded mt-2"
//              />
//               )}

//               <p className="text-xs text-gray-400 mb-3">
//                 Posted by <b>{q.userId?.username || 'Unknown'}</b> at{' '}
//                 {new Date(q.createdAt).toLocaleString()}
//               </p>

//               {/* Like Button */}
//               {/* <button
//                 onClick={() => handleLike(q._id)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mb-4"
//               >
//                 👍 {q.likes?.length || 0} Likes
//               </button> */}

//               {/* Answers */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-bold mb-2 text-white">Answers</h3>
//                 {q.answers.length === 0 && (
//                   <p className="text-gray-500 text-sm italic">No Answers yet.</p>
//                 )}
//                 {q.answers.map((ans, idx) => (
//                   <div
//                     key={idx}
//                     className="border border-gray-700 rounded p-4 bg-gray-700"
//                   >
//                     <p className="mb-2 text-gray-300">
//                       {renderAnswerText(ans.answer, q._id, idx)}
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       - {ans.user?.username || 'Unknown'} at{' '}
//                       {new Date(ans.createdAt).toLocaleString()}
//                     </p>
//                     {/* Like Button */}
//               <button
//                 onClick={() => handleLike(q._id)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mb-4"
//               >
//                 👍 {q.likes?.length || 0} Likes
//               </button>
//                   </div>
                  
//                 ))}
//               </div>

//               {/* Add Answer */}
//               <div className="mt-6 flex gap-3">
//                 <input
//                   type="text"
//                   className="flex-1 p-3 border border-gray-600 rounded bg-gray-900 text-gray-200"
//                   placeholder="Your answer..."
//                   value={answers[q._id] || ''}
//                   onChange={(e) =>
//                     setAnswers({ ...answers, [q._id]: e.target.value })
//                   }
//                 />
//                 <button
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
//                   onClick={() => handleAnswer(q._id)}
//                 >
//                   Reply
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Common;





// Common.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';

const Common = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // input values per question
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [commentInputs, setCommentInputs] = useState({}); // comment input per answer (key: qId-ansId)
  const token = localStorage.getItem('token');

  // Fetch all questions
  const fetchAllQuestions = async () => {
    try {
      if (!token) return setQuestions([]);
      const res = await axios.get('https://crowdsolve-m96y.onrender.com/api/questions/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch (error) {
      console.error('Error fetching questions', error);
    }
  };

  useEffect(() => {
    fetchAllQuestions();
    // eslint-disable-next-line
  }, []);

  // Submit answer to backend
  const handleAnswer = async (qId) => {
    const text = answers[qId];
    if (!text || !text.trim()) return;
    try {
      await axios.post(
        `https://crowdsolve-m96y.onrender.com/api/questions/${qId}/answer`,
        { answer: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswers((p) => ({ ...p, [qId]: '' }));
      fetchAllQuestions();
    } catch (error) {
      console.error('Error submitting answer', error);
    }
  };

  // Like/unlike an answer
  const handleLikeAnswer = async (qId, ansId) => {
    try {
      await axios.post(
        `https://crowdsolve-m96y.onrender.com/api/questions/${qId}/answers/${ansId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAllQuestions();
    } catch (err) {
      console.error('Error liking answer', err);
    }
  };

  // Add a comment to an answer
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
      fetchAllQuestions();
    } catch (err) {
      console.error('Error adding comment', err);
    }
  };

  // Expand/collapse long answers
  const toggleExpand = (qId, ansIdx) => {
    const key = `${qId}-${ansIdx}`;
    setExpandedAnswers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderAnswerText = (answer, qId, ansIdx) => {
    const key = `${qId}-${ansIdx}`;
    const maxLength = 150;
    if (!answer) return '';
    if (answer.length <= maxLength) return answer;

    if (expandedAnswers[key]) {
      return (
        <>
          {answer}{' '}
          <button
            className="text-blue-300 hover:underline ml-2"
            onClick={() => toggleExpand(qId, ansIdx)}
          >
            Read Less
          </button>
        </>
      );
    }

    return (
      <>
        {answer.slice(0, maxLength)}...{' '}
        <button
          className="text-blue-300 hover:underline ml-2"
          onClick={() => toggleExpand(qId, ansIdx)}
        >
          Read More
        </button>
      </>
    );
  };

  // small helper to limit card width and center
  const cardWrapperClass = "max-w-3xl mx-auto";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-gray-200 transition-all duration-500 ">
      {/* NAVBAR */}
      <nav className="w-full p-4 flex items-center justify-between bg-opacity-20 backdrop-blur-sm  bg-gradient-to-t from-[#020617] via-[#0f172a] to-[#1e293b]"> 
        <div className="flex items-center gap-4">
          <Link to="/dash" className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-violet-400 to-sky-400 bg-clip-text text-transparent drop-shadow-lg">CrowdSolve</Link>
          <div className="hidden md:block">
            <div className="text-sm text-gray-300">Solve & Share</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search Bar "
            className="hidden sm:inline-block px-3 py-2 w-72 rounded bg-gray-700 text-gray-200 placeholder-gray-400 transition-all duration-300 focus:scale-105"
          />
          {/* <Link to="/dash" className="text-sm text-blue-300 hover:underline">Dashboard</Link> */}
          <Link
  to="/dash"
  className="relative inline-block text-sm font-medium text-white hover:text-violet-300 transition-colors duration-300
             after:block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
             after:bg-gradient-to-r after:from-purple-400 after:to-violet-400
             hover:after:w-full after:transition-all after:duration-300"
>
  Dashboard
</Link>

          <button
            // className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            // className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-violet-400 hover:scale-105 hover:opacity-90 transition-transform duration-300"
            className="px-6 py-2 rounded-full text-gray-100 font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-violet-400 border border-violet-600 hover:scale-105 hover:opacity-90 shadow-md hover:shadow-lg transition-transform duration-300"
            // className="px-4 py-2 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 hover:scale-105 transition-transform duration-300 shadow-md"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-800 shadow-lg p-6 overflow-y-auto border-r border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">QUESTIONS</h2>
          <ul className="space-y-2">
            {questions.map((q) => (
              <li
                key={q._id}
                className="hover:text-blue-400 cursor-pointer truncate px-2 py-1 rounded transition-colors duration-200"
                title={q.title}
              >
                <div className="text-sm font-medium">{q.title.length > 40 ? q.title.slice(0, 37) + '...' : q.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{q.userId?.username || 'Unknown'}</div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 overflow-y-auto">
        <div className="text-center py-10">
  <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-violet-400 to-sky-400 bg-clip-text text-transparent drop-shadow-lg">
    All Questions
  </h1>
  <p className="text-gray-400 mt-3 text-lg">Discover ideas, discuss solutions, and build knowledge together every day.🌟</p>
</div>

 
          <div className="space-y-10">
            {questions.map((q) => (
              <div key={q._id} className={`bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 transform transition hover:-translate-y-1 ${cardWrapperClass}`}>
                <h2 className="text-2xl font-bold mb-2 text-white">{q.title}</h2>
                <p className="text-gray-300 mb-1">{q.description}</p>
                <p className="text-gray-400 text-sm mb-2">Location: {q.location || 'Not specified'}</p>

                {/* {q.image && (
                  <div className="w-full flex justify-center mb-4">
                    <img
                      src={q.image}
                      alt={q.title}
                      className="w-full max-h-60 object-cover rounded-md shadow-sm"
                    />
                  </div>
                )} */}

{q.image && (
  <div className="w-full flex justify-center mb-4">
    <img
      src={`https://crowdsolve-m96y.onrender.com${q.image}`}
      alt={q.title}
      className="w-full max-h-60 object-cover rounded-md shadow-sm"
    />
  </div>
)}


                <p className="text-xs text-gray-400 mb-3">
                  Posted by <b>{q.userId?.username || 'Unknown'}</b> at {new Date(q.createdAt).toLocaleString()}
                </p>

                {/* Answers */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold mb-2 text-white">Answers</h3>
                  {q.answers.length === 0 && (
                    <p className="text-gray-500 text-sm italic">No Answers yet.</p>
                  )}
                  {q.answers.map((ans, idx) => {
                    const ansKey = `${q._id}-${ans._id || idx}`;
                    return (
                      <div key={ans._id || idx} className="border border-gray-700 rounded p-4 bg-gray-700">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="mb-2 text-gray-300">
                              {renderAnswerText(ans.answer, q._id, idx)}
                            </p>
                            <p className="text-xs text-gray-400 mb-2">
                              - {ans.user?.username || 'Unknown'} at {new Date(ans.createdAt).toLocaleString()}
                            </p>

                            {/* comments list */}
                            <div className="mt-2 space-y-1">
                              {ans.comments && ans.comments.length > 0 && (
                                <>
                                  <div className="text-sm font-medium text-white mb-1">Comments</div>
                                  {ans.comments.map((c, i) => (
                                    <div key={i} className="text-sm text-gray-300 bg-gray-800 p-2 rounded">
                                      <div className="text-xs text-gray-400"> {c.user?.username || 'Unknown'} • {new Date(c.createdAt).toLocaleString()}</div>
                                      <div>{c.text}</div>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>

                            {/* comment input */}
                            <div className="mt-3 flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentInputs[ansKey] || ''}
                                onChange={(e) => setCommentInputs((p) => ({ ...p, [ansKey]: e.target.value }))}
                                className="flex-1 p-2 bg-gray-900 rounded text-gray-200 border border-gray-600"
                              />
                              <button
                                onClick={() => handleAddComment(q._id, ans._id)}
                                className="px-3 py-1 px-4 py-2 rounded-full text-gray-100 font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-violet-400 border border-violet-600 hover:scale-105 hover:opacity-90 shadow-md hover:shadow-lg transition-transform duration-300"
                              >
                                Comment
                              </button>
                            </div>
                          </div>

                          {/* like heart */}
                          <div className="flex flex-col items-center ml-4">
                            <button
                              onClick={() => handleLikeAnswer(q._id, ans._id)}
                              className="p-2 rounded-full hover:scale-105 transform transition"
                              title="Like"
                            >
                              <FaHeart className={`w-6 h-6 ${ans.likes && ans.likes.length > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                            </button>
                            <div className="text-sm text-gray-300 mt-1">{ans.likes ? ans.likes.length : 0}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Answer */}
                <div className="mt-6 flex gap-3">
                  <input
                    type="text"
                    className="flex-1 p-3 border border-gray-600 rounded bg-gray-900 text-gray-200"
                    placeholder="Your answer..."
                    value={answers[q._id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })}
                  />
                  <button
                    className="px-3 py-1 px-6 py-2 rounded-full text-gray-100 font-semibold bg-gradient-to-r from-purple-500 via-violet-500 to-violet-400 border border-violet-600 hover:scale-105 hover:opacity-90 shadow-md hover:shadow-lg transition-transform duration-300 text-white px-5 py-2 rounded"
                    onClick={() => handleAnswer(q._id)}
                  >
                    Send
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Common;
