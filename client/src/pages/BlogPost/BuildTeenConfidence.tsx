
import BlogPost from '@/components/BlogPost';

const BuildTeenConfidence = () => {
  const content = (
    <>
      <p className="lead font-space text-lg mb-6">
        Here's the truth no one talks about: confidence doesn't come from marks. Or medals. Or attending the most expensive tuition center in town.
      </p>

      <p className="mb-4">
        It comes from moments. From experiences. From challenges that push your teen just far enough to realize — <em>hey, I can actually do this.</em>
      </p>

      <p className="mb-6">
        So if you're a parent wondering how to help your child build real confidence (the kind that lasts longer than a test result), you don't need to throw money at tutors. You just need to give them the right environment to grow.
      </p>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Confidence Is Built, Not Taught</h2>
        <p className="mb-4">You can't download confidence into a teenager's brain.</p>
        <p className="mb-4">They have to earn it. Feel it. Internalize it.</p>
        <p className="mb-4">That only happens when they face small but meaningful challenges and come out the other side with a win — or even a lesson.</p>
        <p className="mb-4">Think of it like a gym. You wouldn't expect your teen to build strength without picking up a few weights. Same with confidence. It needs reps.</p>
        
        <p className="mb-4">That means encouraging them to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Try something new</li>
          <li>Speak up in a group</li>
          <li>Take ownership of a task</li>
          <li>Handle failure without shame</li>
        </ul>

        <p className="mb-4">You don't need to lecture them. Just create the space where they can try, fall, and try again — without judgment.</p>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">The Problem With Tutors and Tuitions</h2>
        <p className="mb-4">Tutors aren't evil. But too often, they become a crutch.</p>
        <p className="mb-4">Teens end up thinking, <em>"I'll wait for sir to explain this,"</em> or <em>"I can't do this without help."</em></p>
        <p className="mb-4">That mindset kills initiative. And initiative is the seed of confidence.</p>
        <p className="mb-4">Instead of spoon-feeding, the goal should be to build your teen's sense of agency. The feeling of — <em>I figured this out on my own.</em></p>
        <p className="mb-4">Confidence is never about always knowing the answer. It's about believing you can find it.</p>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">So What Works Better?</h2>
        <p className="mb-4">Experiences that feel like real life.</p>

        <blockquote className="pixel-border p-6 bg-maximally-blue/5 my-6">
          <p className="mb-2">Give your teen a project, not a worksheet.</p>
          <p className="mb-2">Let them join a debate, not another coaching class.</p>
          <p className="mb-0">Help them build a pitch deck, shoot a video, or solve a community problem.</p>
        </blockquote>

        <p className="mb-4">That's where confidence is forged — in action, not theory.</p>
        <p className="mb-4">It's less about <em>learning more</em> and more about <em>believing more in themselves.</em></p>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">What We Do Differently at Maximally</h2>
        <p className="mb-4">At Maximally, we've built our 7-day bootcamp around one goal: to help teens walk taller.</p>
        <p className="mb-4">We don't drown them in slides or prep them for exams. We hand them real challenges — and then step back.</p>
        <p className="mb-4">Public speaking. Team projects. Career simulations. Leadership games. Moments where they have to step up, speak up, and stand out.</p>
        <p className="mb-4">And when they do, something shifts. They don't just learn. They change.</p>
        <p className="mb-4">By Day 7, they've found their voice. And they're using it.</p>

        <div className="flex justify-center my-8">
          <a href="/bootcamps" className="pixel-button bg-[#39FF14] text-black px-8 py-3 font-space font-bold hover:scale-105 transform transition-all">
            👉 Explore the Bootcamp
          </a>
        </div>
      </section>

      <section className="my-8">
        <h2 className="font-space font-bold text-2xl mb-4">Final Thought: Your Teen Is Capable — They Just Need Proof</h2>
        <p className="mb-4">Confidence isn't about being the smartest kid in class. It's about knowing you can figure things out, even when it's hard.</p>
        <p className="mb-4">Give your teen the kind of summer that builds that belief.</p>
        <p className="mb-4">No tutors. No tuitions. Just the right kind of challenge.</p>
        <p className="mb-4">Maximally's summer bootcamp is designed to do exactly that.</p>
        <p className="mb-4">And trust us — one week can change how they walk into every room for the rest of their life.</p>
      </section>
    </>
  );

  return (
    <BlogPost
      title="How to Build Your Teen's Confidence Without Tutors or Tuitions"
      date="May 5, 2025"
      readTime="6 min read"
      content={content}
    />
  );
};

export default BuildTeenConfidence;
