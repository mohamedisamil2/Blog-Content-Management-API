import { useQuery } from "@apollo/client/react";
import { AnalyticsQuery } from "../../graphql/queries/analytics";
import AnalyticsCard from "../../components/AnalyticsCard";
import { FileText, MessageCircle, Tags, Users } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"


interface Analytic {
  totalUsers: number;
  totalPosts: number;
  totalCategories: number;
  totalComments: number;
}

interface AnalyticsQuery {
  analytics: Analytic;
}

function Analytics() {
  
  const { data } = useQuery<AnalyticsQuery>(AnalyticsQuery);

   const cards = [
    { title: 'Total Users', value: data?.analytics.totalUsers ?? 0, icon: <Users size={140} />, color: 'bg-blue-600' },
    { title: 'Total Posts', value: data?.analytics.totalPosts ?? 0, icon: <FileText size={145} />, color: 'bg-emerald-600' },
    { title: 'Total Categories', value: data?.analytics.totalCategories ?? 0, icon: <Tags size={140} />, color: 'bg-amber-600' },
    { title: 'Total Comments', value: data?.analytics.totalComments ?? 0, icon: <MessageCircle size={140} />, color: 'bg-rose-600' },
  ];

  const chartData = [
  { name: 'Users', value: data?.analytics.totalUsers ?? 0 },
  { name: 'Posts', value: data?.analytics.totalPosts ?? 0 },
  { name: 'Categories', value: data?.analytics.totalCategories ?? 0 },
  { name: 'Comments', value: data?.analytics.totalComments ?? 0 },
];

  return (
    <AnimatePresence mode="wait">            
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -30, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full flex flex-col space-y-6 px-4 sm:px-6 lg:px-8">
        <h1 className=" text-2xl font-semibold ">Analytics</h1>
        <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -30, opacity: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <AnalyticsCard key={card.title} {...card} />
        ))}  
      </motion.div>
      <div
        className="bg-white rounded-lg p-6 z-50 shadow-lg"
        >
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Bar dataKey="value" fill="#f43f5e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Analytics