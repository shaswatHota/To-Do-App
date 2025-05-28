 import { CheckCircle, Rocket, Calendar, Bot, Users, BarChart3, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {

    const navigate = useNavigate();

    function handleSignin(){
        navigate("/signin");
    }
    function handleSignup(){
        navigate("/signup");
    }
  return (
 <div className="min-h-screen w-screen bg-white font-sans">
      
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 text-gray-800 px-6  flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#FD6A5E] to-[#FF8A7A] rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A] bg-clip-text text-transparent">Todom</h1>
        </div>
         <div className="hidden md:flex items-center gap-6">
          <div className="text-gray-500 hover:text-gray-700 transition-colors hover:cursor-pointer">Features</div>
          <div className="text-gray-500 hover:text-gray-700 transition-colors hover:cursor-pointer">How it Works</div>
          <SimpleButton variant="outline" onClick={handleSignin}>Sign In</SimpleButton>
          <SimpleButton variant="primary" onClick={handleSignup}>Get Started </SimpleButton>
          </div>
            <div className="md:hidden">
          <SimpleButton variant="primary" size="small" onClick={handleSignup}>Get Started</SimpleButton>
        </div>
      </nav>


      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-[#FD6A5E]/5 via-white to-[#FF8A7A]/5"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-72 h-72 bg-[#FD6A5E]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#FF8A7A]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-16 lg:py-32">

          <div className="flex-1 text-center lg:text-left mb-12 lg:mb-0">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FD6A5E]/10 to-[#FF8A7A]/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#FD6A5E]" />
              <span className="text-sm font-medium text-[#FD6A5E]">AI-Powered Task Management</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Organize Your
              <span className="block bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A] bg-clip-text text-transparent">
                Goals, Smartly
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mb-8 leading-7 mx-auto lg:mx-0">
              Track tasks, generate AI-powered roadmaps, and stay productive with our intelligent task management platform. Transform your productivity today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <SimpleButton variant="primary" size="large" onClick={handleSignup}>
                Get Started
                <Rocket className="ml-2 w-5 h-5" />
              </SimpleButton>
              <SimpleButton variant="outline" size="large"  onClick={handleSignin}>
                Sign In
              </SimpleButton>
            </div>
            

             <div className="flex items-center justify-center lg:justify-start gap-6 lg:gap-8 mt-12">
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">10k+</div>
                <div className="text-xs lg:text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">50k+</div>
                <div className="text-xs lg:text-sm text-gray-600">Tasks Completed</div>
              </div>
              <div className="text-center">
                 <div className="text-xl lg:text-2xl font-bold text-gray-900">99%</div>
                <div className="text-xs lg:text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>


           <div className="flex-1 relative max-w-2xl w-full">
            <div className="relative">

                <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 z-10 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">84% Completed</span>
                </div>
              </div>
              
               <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 z-10 hidden sm:block">
                <div className="flex items-center gap-3">
                  <Bot className="w-5 h-5 text-[#FD6A5E]" />
                  <span className="text-sm font-medium text-gray-700">AI Roadmap Ready</span>
                </div>
              </div>

              
              <SimpleCard className="p-6 lg:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FD6A5E]/20 to-[#FF8A7A]/20 rounded-full blur-2xl"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
                    <span className="text-sm text-gray-600 hidden sm:block">Tuesday, 27/05/2025</span>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <TaskItem 
                      title="Complete project proposal" 
                      status="In Progress" 
                      priority="High"
                      color="blue"
                    />
                    <TaskItem 
                      title="Review design mockups" 
                      status="Completed" 
                      priority="Medium"
                      color="green"
                    />
                    <TaskItem 
                      title="Team standup meeting" 
                      status="Pending" 
                      priority="Low"
                      color="orange"
                    />
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-[#FD6A5E]/5 to-[#FF8A7A]/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-[#FD6A5E]" />
                      <span className="text-sm font-medium text-[#FD6A5E]">AI Suggestion</span>
                    </div>
                    <p className="text-sm text-gray-600">Break down your project proposal into smaller tasks for better focus.</p>
                  </div>
                </div>
              </SimpleCard>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to stay organized, productive, and achieve your goals faster than ever before.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              Icon={Calendar} 
              title="Smart Task Manager" 
              desc="Intuitive task creation with smart categorization, due dates, and priority levels."
              gradient="from-blue-500 to-blue-600"
            />
            <FeatureCard 
              Icon={Bot} 
              title="AI-Powered Roadmaps" 
              desc="Get personalized learning paths and goal plans generated by advanced AI."
              gradient="from-[#FD6A5E] to-[#FF8A7A]"
            />
            <FeatureCard 
              Icon={BarChart3} 
              title="Progress Analytics" 
              desc="Detailed insights and visualizations to track your productivity and achievements."
              gradient="from-emerald-500 to-emerald-600"
            />
            <FeatureCard 
              Icon={Users} 
              title="Team Collaboration" 
              desc="Work together seamlessly with shared projects and real-time updates."
              gradient="from-purple-500 to-purple-600"
            />
            <FeatureCard 
              Icon={CheckCircle} 
              title="Goal Tracking" 
              desc="Set, monitor, and celebrate your milestones with comprehensive goal management."
              gradient="from-indigo-500 to-indigo-600"
            />
            <FeatureCard 
              Icon={Rocket} 
              title="Lightning Performance" 
              desc="Built with cutting-edge technology for instant loading and smooth interactions."
              gradient="from-orange-500 to-orange-600"
            />
          </div>
        </div>
      </section>


      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              step="1" 
              title="Create Your Account" 
              desc="Sign up securely and set up your personalized workspace in seconds."
              icon={Users}
            />
            <StepCard 
              step="2" 
              title="Add Tasks or Generate Plans" 
              desc="Manually create tasks or let our AI generate comprehensive roadmaps for your goals."
              icon={Bot}
            />
            <StepCard 
              step="3" 
              title="Track and Achieve" 
              desc="Monitor progress, complete tasks, and celebrate your achievements along the way."
              icon={CheckCircle}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A]"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Your Productivity?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have already revolutionized their task management.
          </p>
          <SimpleButton variant="white" size="large">
            Start Your Free Trial
            <Rocket className="ml-2 w-5 h-5" />
          </SimpleButton>
        </div>
      </section>


      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FD6A5E] to-[#FF8A7A] rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">Todom</h4>
              </div>
              <p className="text-gray-400">
                The smart way to manage tasks and achieve your goals.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2">
                <li><div href="#" className="text-gray-400 hover:text-white transition-colors">Features</div></li>
                <li><div href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</div></li>
                <li><div href="#" className="text-gray-400 hover:text-white transition-colors">API</div></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2">
                <li><div href="#" className="text-gray-400 hover:text-white transition-colors">About</div></li>
                <li><div href="#" className="text-gray-400 hover:text-white transition-colors">Blog</div></li>
                <li><div href="#" className="text-gray-400 hover:text-white transition-colors">Careers</div></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2">
                <li><div href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</div></li>
                <li><div href="#" className="text-gray-400 hover:text-white transition-colors">Contact</div></li>
                <li><div href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</div></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TaskMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SimpleButton({ children, variant = 'primary', size = 'default', className = '', ...props }) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold border-none cursor-pointer transition-all duration-300";

  const variants = {
    primary: "bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A] text-white shadow-lg hover:shadow-xl",
    outline: "border-2 border-[#FD6A5E] text-[#FD6A5E] bg-transparent hover:bg-[#FD6A5E] hover:text-white",
    white: "bg-white text-[#FD6A5E] shadow-lg hover:shadow-xl"
  };

  const sizes = {
     small: "px-3 py-2 text-sm",
    default: "px-4 py-3 text-sm",
    large: "px-6 py-4 lg:px-8 lg:py-6 text-base lg:text-lg"
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function SimpleCard({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-white rounded-3xl shadow-2xl border border-gray-100 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

function FeatureCard({ Icon, title, desc, gradient }) {
  return (
    <SimpleCard className="p-8 hover:shadow-3xl transition-all duration-300">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h4 className="text-xl font-semibold mb-3 text-gray-900">{title}</h4>
      <p className="text-gray-600 leading-7">{desc}</p>
    </SimpleCard>
  );
}

function StepCard({ step, title, desc, icon: Icon }) {
  return (
    <div className="text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A] rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300">
          <Icon className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-2 right-1/2 transform translate-x-12 w-8 h-8 bg-white border-4 border-[#FD6A5E] rounded-full flex items-center justify-center text-sm font-bold text-[#FD6A5E]">
          {step}
        </div>
      </div>
      <h5 className="text-xl font-semibold mb-3 text-gray-900">{title}</h5>
      <p className="text-gray-600 leading-7">{desc}</p>
    </div>
  );
}

function TaskItem({ title, status, priority, color }) {
  const statusColors = {
    'Completed': 'text-emerald-600 bg-emerald-50',
    'In Progress': 'text-blue-600 bg-blue-50',
    'Pending': 'text-orange-600 bg-orange-50'
  };

  const priorityColors = {
    'High': 'border-red-300',
    'Medium': 'border-yellow-300',
    'Low': 'border-green-300'
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${priorityColors[priority]} bg-gray-50`}>
      <div className="flex items-center gap-3">
        <CheckCircle className={`w-5 h-5 ${status === 'Completed' ? 'text-emerald-500' : 'text-gray-300'}`} />
        <span className={`text-sm font-medium ${status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
          {title}
        </span>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    </div>
  );
}
