import { BlogPost, BlogCategory } from '../types';

export const blogCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Toán THCS',
    slug: 'toan-thcs',
    description: 'Phương pháp học Toán lớp 6, 7, 8, 9',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Văn THCS',
    slug: 'van-thcs',
    description: 'Kỹ năng học Văn lớp 6, 7, 8, 9',
    color: '#10B981',
  },
  {
    id: '3',
    name: 'Ôn thi lớp 10',
    slug: 'on-thi-lop-10',
    description: 'Luyện thi vào lớp 10 Toán, Văn',
    color: '#F59E0B',
  },
  {
    id: '4',
    name: 'Tiền tiểu học',
    slug: 'tien-tieu-hoc',
    description: 'Chuẩn bị cho bé vào lớp 1',
    color: '#EF4444',
  },
  {
    id: '5',
    name: 'Kỹ năng học tập',
    slug: 'ky-nang-hoc-tap',
    description: 'Phương pháp và mẹo học hiệu quả',
    color: '#8B5CF6',
  },
  {
    id: '6',
    name: 'Làm bài kiểm tra',
    slug: 'lam-bai-kiem-tra',
    description: 'Kỹ thuật làm bài thi và kiểm tra',
    color: '#06B6D4',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Phương pháp học Toán hiệu quả cho học sinh THCS',
    subtitle: '10 bí quyết giúp em học Toán lớp 6, 7, 8, 9 dễ dàng hơn',
    content: `
      <h2>1. Nắm vững kiến thức cơ bản</h2>
      <p>Toán học là môn tích lũy, mỗi chương đều có mối liên hệ với nhau. Hãy đảm bảo hiểu rõ định nghĩa, tính chất và công thức trước khi chuyển sang bài mới.</p>
      
      <h2>2. Làm nhiều bài tập từ dễ đến khó</h2>
      <p>Bắt đầu với bài tập cơ bản trong SGK, sau đó làm SBT và cuối cùng là các đề thi học kỳ. Mỗi dạng bài cần làm ít nhất 5-10 bài để thành thạo.</p>
      
      <h2>3. Ghi nhớ công thức bằng sơ đồ tư duy</h2>
      <p>Tạo sơ đồ tư duy cho từng chương, ghi rõ công thức và cách áp dụng. Điều này giúp ghi nhớ lâu hơn và dễ ôn tập.</p>
      
      <h2>4. Học nhóm và giải thích cho bạn</h2>
      <p>Khi giải thích bài cho bạn, em sẽ hiểu sâu hơn về kiến thức. Học nhóm cũng giúp em học được nhiều cách giải khác nhau.</p>
      
      <h2>5. Ôn tập thường xuyên</h2>
      <p>Mỗi tuần dành 1-2 tiết để ôn lại các bài đã học. Không để tích lũy quá nhiều kiến thức rồi mới ôn.</p>
    `,
    excerpt:
      'Chia sẻ những phương pháp học Toán hiệu quả dành riêng cho học sinh THCS, giúp các em nắm vững kiến thức từ lớp 6 đến lớp 9.',
    author: 'Thầy Nguyễn Văn An',
    publishedAt: '2024-01-15T10:00:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: blogCategories[0],
    tags: ['toán THCS', 'phương pháp học', 'lớp 6', 'lớp 7', 'lớp 8', 'lớp 9'],
    status: 'published',
    featured: true,
    readTime: 8,
    viewCount: 1250,
  },
  {
    id: '2',
    title: 'Kỹ năng làm bài Văn THCS đạt điểm cao',
    subtitle: 'Hướng dẫn chi tiết cách viết bài văn lớp 6, 7, 8, 9',
    content: `
      <h2>Kỹ năng đọc hiểu văn bản</h2>
      <p>Đọc kỹ đề bài và văn bản, gạch chân từ khóa quan trọng. Xác định thể loại văn bản và chủ đề chính để định hướng cách trả lời.</p>
      
      <h2>Cách viết bài văn nghị luận</h2>
      <p>Cấu trúc: Mở bài (nêu vấn đề) - Thân bài (luận chứng với ví dụ cụ thể) - Kết bài (khẳng định quan điểm). Sử dụng câu chủ đề rõ ràng cho mỗi đoạn.</p>
      
      <h2>Kỹ thuật viết bài tả</h2>
      <p>Quan sát kỹ đối tượng tả, sắp xếp trình tự từ tổng thể đến chi tiết. Sử dụng đa dạng biện pháp tu từ để làm cho bài viết sinh động.</p>
      
      <h2>Cách phân tích tác phẩm văn học</h2>
      <p>Nắm vững nội dung tác phẩm, xác định chủ đề và ý nghĩa. Phân tích nghệ thuật qua nhân vật, ngôn ngữ, cấu trúc.</p>
    `,
    excerpt:
      'Hướng dẫn chi tiết các kỹ năng làm bài Văn THCS, từ đọc hiểu đến viết văn, giúp các em tự tin đạt điểm cao trong các kỳ thi.',
    author: 'Cô Trần Thị Bình',
    publishedAt: '2024-01-12T14:30:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: blogCategories[1],
    tags: ['văn THCS', 'viết văn', 'đọc hiểu', 'nghị luận', 'tả'],
    status: 'published',
    featured: true,
    readTime: 6,
    viewCount: 980,
  },
  {
    id: '3',
    title: 'Chiến lược ôn thi vào lớp 10 hiệu quả',
    subtitle: 'Lộ trình ôn tập Toán - Văn để đạt điểm cao',
    content: `
      <h2>Lập kế hoạch ôn tập chi tiết</h2>
      <p>Chia thời gian ôn tập hợp lý: 40% cho Toán, 35% cho Văn, 25% cho Tiếng Anh. Mỗi tuần dành 2 buổi làm đề thi thử để đánh giá năng lực.</p>
      
      <h2>Ôn tập Toán lớp 10</h2>
      <p>Tập trung vào đại số (phương trình, bất phương trình, hàm số) và hình học (tam giác, đường tròn, tính diện tích). Làm kỹ các dạng bài trong đề thi tuyển sinh các năm trước.</p>
      
      <h2>Ôn tập Văn lớp 10</h2>
      <p>Ôn kỹ các tác phẩm văn học đã học, nắm vững cấu trúc bài văn nghị luận và cách phân tích đoạn thơ, đoạn văn. Luyện viết văn theo các chủ đề thường gặp.</p>
      
      <h2>Kỹ thuật làm bài thi</h2>
      <p>Phân bổ thời gian hợp lý cho từng câu, làm câu dễ trước. Kiểm tra lại bài làm trước khi nộp, đặc biệt chú ý chính tả và tính toán.</p>
    `,
    excerpt:
      'Hướng dẫn chi tiết lộ trình ôn thi vào lớp 10, từ lập kế hoạch đến kỹ thuật làm bài, giúp các em đạt kết quả cao nhất.',
    author: 'Thầy Lê Văn Cường',
    publishedAt: '2024-01-10T09:15:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: blogCategories[2],
    tags: ['ôn thi lớp 10', 'toán', 'văn', 'kỹ thuật thi', 'lộ trình'],
    status: 'published',
    featured: false,
    readTime: 5,
    viewCount: 750,
  },
  {
    id: '4',
    title: 'Chuẩn bị cho bé vào lớp 1: Hướng dẫn cho phụ huynh',
    subtitle: 'Những kỹ năng cơ bản bé cần có trước khi vào tiểu học',
    content: `
      <h2>Kỹ năng đọc viết cơ bản</h2>
      <p>Dạy bé nhận biết và viết các chữ cái, đọc được những từ đơn giản. Không nên ép bé học quá nhanh mà hãy tạo hứng thú thông qua trò chơi và sách tranh.</p>
      
      <h2>Kỹ năng toán đơn giản</h2>
      <p>Bé cần biết đếm từ 1-20, nhận biết các con số và thực hiện phép cộng trừ trong phạm vi 10. Sử dụng đồ vật cụ thể để dạy sẽ hiệu quả hơn.</p>
      
      <h2>Kỹ năng sống cần thiết</h2>
      <p>Dạy bé tự chăm sóc bản thân: thay đồ, đi vệ sinh, ăn uống độc lập. Rèn luyện thói quen ngồi yên, lắng nghe và làm theo hướng dẫn.</p>
      
      <h2>Kỹ năng xã hội</h2>
      <p>Giúp bé học cách giao tiếp với bạn bè, chia sẻ đồ chơi và giải quyết xung đột đơn giản. Điều này rất quan trọng cho việc hòa nhập ở trường.</p>
    `,
    excerpt:
      'Hướng dẫn phụ huynh cách chuẩn bị cho con em mình những kỹ năng cần thiết trước khi bước vào môi trường tiểu học.',
    author: 'Cô Phạm Minh Đức',
    publishedAt: '2024-01-08T16:45:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: blogCategories[3],
    tags: ['tiền tiểu học', 'chuẩn bị vào lớp 1', 'kỹ năng cơ bản', 'phụ huynh'],
    status: 'published',
    featured: false,
    readTime: 7,
    viewCount: 1100,
  },
  {
    id: '5',
    title: '7 thói quen học tập hiệu quả mọi học sinh cần có',
    subtitle: 'Những kỹ năng học tập cơ bản giúp em thành công ở trường',
    content: `
      <h2>Thói quen lập kế hoạch học tập</h2>
      <p>Mỗi ngày dành 10 phút để lập kế hoạch học. Chia nhỏ công việc lớn thành các nhiệm vụ nhỏ, đặt deadline cụ thể và ưu tiên những việc quan trọng nhất.</p>
      
      <h2>Kỹ năng ghi chú hiệu quả</h2>
      <p>Học cách ghi chú bằng sơ đồ tư duy, sử dụng màu sắc và ký hiệu để làm nổi bật thông tin quan trọng. Ôn lại ghi chú ngay sau buổi học.</p>
      
      <h2>Thói quen đọc sách mỗi ngày</h2>
      <p>Dành ít nhất 30 phút mỗi ngày để đọc sách, không chỉ sách giáo khoa mà còn sách tham khảo và sách ngoại khóa để mở rộng kiến thức.</p>
      
      <h2>Kỹ năng quản lý thời gian</h2>
      <p>Sử dụng kỹ thuật Pomodoro: học 25 phút, nghỉ 5 phút. Tránh làm nhiều việc cùng lúc và loại bỏ các yếu tố gây phân tâm khi học.</p>
      
      <h2>Thói quen tự kiểm tra kiến thức</h2>
      <p>Thường xuyên tự đặt câu hỏi và trả lời, làm bài tập ôn tập. Giải thích kiến thức cho người khác để kiểm tra mức độ hiểu bài.</p>
    `,
    excerpt:
      'Chia sẻ 7 thói quen học tập thiết yếu giúp học sinh THCS phát triển kỹ năng tự học và đạt kết quả tốt trong học tập.',
    author: 'Cô Nguyễn Thị Hoa',
    publishedAt: '2024-01-05T11:20:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: blogCategories[4],
    tags: ['kỹ năng học tập', 'thói quen', 'tự học', 'quản lý thời gian'],
    status: 'published',
    featured: false,
    readTime: 9,
    viewCount: 850,
  },
  {
    id: '6',
    title: 'Bí quyết làm bài kiểm tra đạt điểm cao',
    subtitle: 'Kỹ thuật làm bài thi hiệu quả cho học sinh THCS',
    content: `
      <h2>Chuẩn bị trước khi làm bài</h2>
      <p>Đọc kỹ đề bài 2-3 lần, gạch chân từ khóa quan trọng. Phân bổ thời gian hợp lý cho từng câu hỏi dựa trên điểm số và độ khó.</p>
      
      <h2>Chiến lược làm bài hiệu quả</h2>
      <p>Làm những câu dễ và chắc chắn trước để tạo tự tin. Với câu khó, hãy viết những gì biết để được điểm từng phần. Không bỏ trống câu nào.</p>
      
      <h2>Kỹ thuật làm bài Toán</h2>
      <p>Viết rõ công thức, trình bày từng bước giải. Kiểm tra lại phép tính và đơn vị. Vẽ hình chính xác và ghi đầy đủ giả thiết, kết luận.</p>
      
      <h2>Kỹ thuật làm bài Văn</h2>
      <p>Đọc hiểu: Đọc kỹ văn bản, xác định thể loại và chủ đề. Viết văn: Lập dàn ý trước, viết chữ rõ ràng, chú ý chính tả và dấu câu.</p>
      
      <h2>Kiểm tra bài làm</h2>
      <p>Dành 10-15% thời gian cuối để kiểm tra lại. Tập trung vào những lỗi thường mắc: tính toán sai, thiếu đơn vị, lỗi chính tả.</p>
    `,
    excerpt:
      'Hướng dẫn kỹ thuật làm bài kiểm tra và thi cử hiệu quả, giúp học sinh THCS tự tin đạt điểm số cao nhất có thể.',
    author: 'Thầy Hoàng Văn Nam',
    publishedAt: '2024-01-03T13:10:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1606227583206-94b3bee40a0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: blogCategories[5],
    tags: ['làm bài kiểm tra', 'kỹ thuật thi', 'toán', 'văn', 'điểm cao'],
    status: 'published',
    featured: false,
    readTime: 6,
    viewCount: 920,
  },
  {
    id: '7',
    title: 'Phương pháp giải nhanh bài tập Hình học lớp 8',
    subtitle: 'Các dạng bài thường gặp và cách giải hiệu quả',
    content: `
      <h2>Tam giác đồng dạng - Định lý Thales</h2>
      <p>Nắm vững các trường hợp đồng dạng: c.c.c, c.g.c, g.g. Áp dụng tỉ số đồng dạng để tính độ dài cạnh và diện tích. Chú ý vẽ hình chính xác.</p>
      
      <h2>Hình thang - Hình bình hành</h2>
      <p>Ghi nhớ tính chất và dấu hiệu nhận biết. Sử dụng tính chất đường trung bình để giải bài tập. Áp dụng công thức tính diện tích phù hợp.</p>
      
      <h2>Đường tròn và góc nội tiếp</h2>
      <p>Nắm vững tính chất góc nội tiếp, góc ở tâm. Sử dụng định lý về góc tạo bởi tia tiếp tuyến và dây cung để chứng minh.</p>
    `,
    excerpt:
      'Tổng hợp các phương pháp giải nhanh bài tập Hình học lớp 8, giúp các em nắm vững kiến thức và làm bài hiệu quả.',
    author: 'Thầy Lê Minh Tuấn',
    publishedAt: '2024-01-01T08:00:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: blogCategories[0],
    tags: ['toán 8', 'hình học', 'tam giác đồng dạng', 'đường tròn'],
    status: 'published',
    featured: false,
    readTime: 7,
    viewCount: 680,
  },
  {
    id: '8',
    title: 'Cách phân tích tác phẩm văn học THCS',
    subtitle: 'Kỹ năng đọc hiểu và phân tích văn bản hiệu quả',
    content: `
      <h2>Xác định thể loại và đặc điểm</h2>
      <p>Phân biệt rõ thơ, truyện ngắn, kí, tùy bút. Nắm vững đặc điểm của từng thể loại để định hướng cách phân tích phù hợp.</p>
      
      <h2>Phân tích nội dung và chủ đề</h2>
      <p>Tóm tắt nội dung chính, xác định chủ đề và thông điệp tác giả muốn truyền tải. Tìm hiểu hoàn cảnh sáng tác để hiểu sâu hơn.</p>
      
      <h2>Phân tích nghệ thuật</h2>
      <p>Phân tích ngôn ngữ, biện pháp tu từ, cấu trúc tác phẩm. Đánh giá tác dụng của các yếu tố nghệ thuật đối với nội dung.</p>
    `,
    excerpt:
      'Hướng dẫn chi tiết cách phân tích tác phẩm văn học THCS, từ xác định thể loại đến phân tích nghệ thuật một cách khoa học.',
    author: 'Cô Nguyễn Thị Lan',
    publishedAt: '2023-12-28T15:30:00Z',
    imageUrl:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: blogCategories[1],
    tags: ['văn học', 'phân tích', 'đọc hiểu', 'THCS'],
    status: 'published',
    featured: false,
    readTime: 8,
    viewCount: 540,
  },
];

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured && post.status === 'published');
};

export const getPostsByCategory = (categoryId: string): BlogPost[] => {
  return blogPosts.filter(post => post.category.id === categoryId && post.status === 'published');
};

export const getLatestPosts = (limit: number = 6): BlogPost[] => {
  return blogPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const getPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id && post.status === 'published');
};

export const getRelatedPosts = (postId: string, limit: number = 3): BlogPost[] => {
  const currentPost = getPostById(postId);
  if (!currentPost) return [];

  return blogPosts
    .filter(
      post =>
        post.id !== postId &&
        post.status === 'published' &&
        (post.category.id === currentPost.category.id ||
          post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit);
};
