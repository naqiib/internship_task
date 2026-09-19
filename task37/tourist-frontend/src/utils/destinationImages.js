import northernAreasImg from '../assets/northern-areas.jpg';

const imageMap = {
  'kalash': 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Kalash_of_Birir_Valley_%28Coniferous_Forest%29%3B_Tahsin_Shah_01.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original',
  'hunza': 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Hunza_Valley_HDR.jpg?utm_source=en.wikivoyage.org&utm_campaign=index&utm_content=original',
  'tirich': 'https://hunzaguidespakistan.com/wp-content/uploads/2022/02/Tirich-Mir-Peak-1.jpg',
  'terich': 'https://hunzaguidespakistan.com/wp-content/uploads/2022/02/Tirich-Mir-Peak-1.jpg',
  'chitral': 'https://hunzaguidespakistan.com/wp-content/uploads/2022/02/Tirich-Mir-Peak-1.jpg',
  'skardu': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQwIUa-samgJitTbF4ncqOxDPdPDVcs_rigDELAfk6-adC5MYi9UZPOLc&s=10',
  'fairy': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
  'naran': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85'
};

export function getDestinationImage(name = '', location = '') {
  const text = `${name} ${location}`.toLowerCase();
  
  for (const [key, img] of Object.entries(imageMap)) {
    if (text.includes(key)) {
      return img;
    }
  }
  
  return northernAreasImg;
}
