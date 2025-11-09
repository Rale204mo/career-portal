exports.getJobs = async (req, res) => {
  try {
    res.json({ 
      message: 'Jobs retrieved successfully',
      data: [
        { id: 1, title: 'Software Engineer', company: 'Tech Corp' },
        { id: 2, title: 'Data Analyst', company: 'Data Inc' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    res.status(201).json({ 
      message: 'Job created successfully',
      data: req.body
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};