
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* First Column */}
          <div className="mb-8">
            <h5 className="text-md font-semibold mb-4">Company</h5>
            <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-300 hover:text-white text-sm">About Us</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white text-sm">Careers</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-white text-sm">Contact</a>
            </li>
            </ul>
          </div>

          {/* Second Column */}
          <div className="mb-8">
            <h5 className="text-md font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Support</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Third Column */}
          <div className="mb-8">
            <h5 className="text-md font-semibold mb-4">Services</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Web Development</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Mobile App Development</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white text-sm">Consulting</a></li>
            </ul>
          </div>

          {/* Fourth Column: Newsletter Subscription */}
          <div className="mb-8">
            <h5 className="text-md font-semibold mb-4">Subscribe to our newsletter</h5>
            <p className="text-gray-300 hover:text-white text-md pb-3">The latest news, articles, and resources, sent to your inbox weekly.</p>
            <form action="#" method="POST">
              <div className="flex">
                <input
                  type="email"
                  className="form-input rounded-l-lg px-4 py-2 w-full bg-gray-600"
                  placeholder="Enter your email"
                  required
                />
                <button type="submit" className="bg-transparent   text-white px-6 py-2 rounded-r-lg hover:bg-blue-600">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        <hr className="my-6 border-gray-600" />

        {/* Bottom Social Links */}
        <div className="flex justify-between items-center">
          <span className="text-sm">© 2025 collabdesk. All Rights Reserved.</span>
          <div>
            <a href="#" className="text-white mx-2 hover:text-gray-400"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-white mx-2 hover:text-gray-400"><i className="fab fa-x"></i></a>
            <a href="#" className="text-white mx-2 hover:text-gray-400"><i className="fab fa-facebook"></i></a>
            <a href="#" className="text-white mx-2 hover:text-gray-400"><i className="fab fa-github"></i></a>
            <a href="#" className="text-white mx-2 hover:text-gray-400"><i className="fab fa-discord"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
