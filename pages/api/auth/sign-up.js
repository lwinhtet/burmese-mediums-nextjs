import axios from 'axios';

export default async function handler(req, res) {
  try {
    const endpoint = `${process.env.API_HOST}/api/v1/users/signup`;
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.password,
      termAgreed: req.body.termAgreed
    };

    return axios
      .post(endpoint, data)
      .then(response => res.status(response.status).json(response.data))
      .catch(error => {
        console.log(11, error.response);
        res.status(error.response.status).json(error.response.data);
      });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong! Try again Later.'
    });
  }
}
