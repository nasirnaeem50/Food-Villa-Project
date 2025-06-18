import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We'd love to hear from you! Reach out with questions, feedback, or just to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Get In Touch</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Subject"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your message..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-200 dark:bg-orange-600 dark:hover:bg-orange-700"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                    <FaMapMarkerAlt className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Address</h4>
                    <p className="text-gray-600 dark:text-gray-300"> Peshawar, Khyber Pakhtunkhwa, Pakistan</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                    <FaPhone className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-300">+92 (91) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                    <FaEnvelope className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300">info@foodvilla.pk</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                    <FaClock className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Hours</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Monday - Friday: 11:00 AM - 10:00 PM<br />
                      Saturday - Sunday: 10:00 AM - 11:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full text-gray-700 dark:text-gray-300 hover:bg-orange-100 hover:text-orange-500 dark:hover:bg-orange-900/30 dark:hover:text-orange-400 transition"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full text-gray-700 dark:text-gray-300 hover:bg-orange-100 hover:text-orange-500 dark:hover:bg-orange-900/30 dark:hover:text-orange-400 transition"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full text-gray-700 dark:text-gray-300 hover:bg-orange-100 hover:text-orange-500 dark:hover:bg-orange-900/30 dark:hover:text-orange-400 transition"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211749.931915989!2d71.3768309!3d33.9775455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d917b90f0e79cf%3A0xa816b2637558a412!2sPeshawar%2C%20Khyber%20Pakhtunkhwa%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1623251156837!5m2!1sen!2sus"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Peshawar Location Map"
                className="dark:filter dark:brightness-75"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;