import * as ReactIcons from 'lucide-react';

export type TaskType = 'social_media' | 'email' | 'summarize' | 'product_description' | 'customer_query';

export interface ContentType {
  id: string;
  label: string;
  icon: keyof typeof ReactIcons;
  taskType: TaskType;
  preset: Record<string, string>;
}

export const CONTENT_TYPES: ContentType[] = [
  { id: 'linkedin_post', label: 'LinkedIn Post', icon: 'Linkedin', taskType: 'social_media', preset: { platform: 'LinkedIn' } },
  { id: 'twitter_post', label: 'X (Twitter)', icon: 'Twitter', taskType: 'social_media', preset: { platform: 'Twitter' } },
  { id: 'instagram_caption', label: 'Instagram Caption', icon: 'Instagram', taskType: 'social_media', preset: { platform: 'Instagram' } },
  { id: 'facebook_post', label: 'Facebook Post', icon: 'Facebook', taskType: 'social_media', preset: { platform: 'Facebook' } },
  { id: 'threads_post', label: 'Threads', icon: 'MessageCircle', taskType: 'social_media', preset: { platform: 'Threads' } },
  { id: 'blog_post', label: 'Blog Post', icon: 'FileText', taskType: 'summarize', preset: {} },
  { id: 'newsletter', label: 'Newsletter', icon: 'Mail', taskType: 'email', preset: { recipient: 'Subscribers' } },
  { id: 'cold_email', label: 'Cold Email', icon: 'Send', taskType: 'email', preset: { tone: 'Persuasive' } },
  { id: 'professional_email', label: 'Professional Email', icon: 'Briefcase', taskType: 'email', preset: { tone: 'Professional' } },
  { id: 'product_desc', label: 'Product Description', icon: 'Package', taskType: 'product_description', preset: {} },
  { id: 'support_reply', label: 'Customer Support Reply', icon: 'Headset', taskType: 'customer_query', preset: {} },
  { id: 'resume_summary', label: 'Resume Summary', icon: 'User', taskType: 'product_description', preset: { productName: 'Professional Profile', targetCustomers: 'Hiring Managers' } },
  { id: 'cover_letter', label: 'Cover Letter', icon: 'FileSignature', taskType: 'email', preset: { recipient: 'Hiring Manager', tone: 'Professional' } },
  { id: 'press_release', label: 'Press Release', icon: 'Megaphone', taskType: 'summarize', preset: {} },
  { id: 'youtube_desc', label: 'YouTube Description', icon: 'Youtube', taskType: 'social_media', preset: { platform: 'YouTube' } },
];

export const AI_ACTIONS = [
  { label: 'Improve', modifier: 'Improve the text to be better written and more engaging.' },
  { label: 'Rewrite', modifier: 'Completely rewrite this text with a fresh perspective.' },
  { label: 'Shorten', modifier: 'Make this text much shorter and concise.' },
  { label: 'Expand', modifier: 'Expand on this text with more details and depth.' },
  { label: 'Make Professional', modifier: 'Rewrite this text to be highly professional and formal.' },
  { label: 'Make Friendly', modifier: 'Rewrite this text to sound friendly, warm, and approachable.' },
  { label: 'Make Funny', modifier: 'Rewrite this text to be humorous and witty.' },
  { label: 'Make Persuasive', modifier: 'Rewrite this text to be highly persuasive and compelling.' },
  { label: 'Add Emojis', modifier: 'Incorporate relevant emojis naturally throughout the text.' },
  { label: 'Fix Grammar', modifier: 'Fix any grammar, spelling, or punctuation errors.' },
  { label: 'Generate Hashtags', modifier: 'Append 5-10 relevant hashtags to the end of the text.' },
  { label: 'Generate CTA', modifier: 'Add a strong Call To Action at the end of the text.' },
];
