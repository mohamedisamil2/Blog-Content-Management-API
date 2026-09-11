import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

function Hero() {
  return (
   <section className="hero min-h-[60vh] bg-linear-to-br from-rose-200 via-rose-50 to-rose-100">
                    <div className="hero-content text-center">
                        <div className="max-w-xl">
                            <h1 className="text-5xl font-bold text-gray-900">
                                Daily <span className="text-rose-500">Blog</span>
                            </h1>
                            <p className="py-6 text-gray-500">
                                أفكار، مقالات تقنية، وقصص يومية — كل حاجة جديدة تلاقيها هنا كل يوم
                            </p>
                            <Link to="/post" className="btn btn-error btn-outline gap-2">
                                Browse All Posts <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </section>
  )
}

export default Hero
