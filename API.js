//const BaseURL = 'https://awsubs-api.khairul.my.id/';
//const BaseURL = 'http://192.168.43.48:8080/';
const BaseURL = 'http://192.168.57.1:8080/';

const getLatest = async page => {
  try {
    const response = await fetch(BaseURL + (page ? `page/${page}` : ''));
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.log(error);
  }
  return {featured: [], latest: [], ongoing: []};
};

const getReleaseById = async id => {
  try {
    const response = await fetch(BaseURL + `release/${id}`);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export default {
  getLatest,
  getReleaseById,
};
