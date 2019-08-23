// api/service.js

import axios from "axios";

export default class SessionRatingService {
  constructor() {
    let service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/session-rating`,
      withCredentials: true
    });
    this.service = service;
  }

  errorHandler = err => {
    // console.error(err);
    throw err;
  };

  details(body) {
    return this.service
      .post("/details", body)
      .then(res => res.data)
      .catch(this.errorHandler);
  }
}
