Đặc tả yêu cầu phần mềm FREVO

FREVO là nền tảng kết nối doanh nghiệp nhỏ tại Việt Nam với freelancer sáng tạo cá nhân hoặc nhóm. Tài liệu này mô tả phạm vi MVP, luồng tuyển chọn và các yêu cầu hệ thống để nhóm thiết kế, phát triển và kiểm thử.

# 1\. Giới thiệu

## 1.1 Mục đích tài liệu

Tài liệu này mô tả các yêu cầu chức năng và phi chức năng của FREVO. Mục tiêu là giúp ba thành viên thống nhất phạm vi sản phẩm, nghiệp vụ và các màn hình cần có trước khi thiết kế và phát triển sản phẩm.

## 1.2 Tổng quan sản phẩm

FREVO – Where Freelancers Evolve là nền tảng kết nối Business nhỏ tại Việt Nam với Creative Freelancer cá nhân hoặc Team. Business đăng Project Brief và tìm ứng viên; Freelancer giới thiệu kỹ năng/portfolio gồm hình ảnh, video hoặc liên kết phù hợp và tiếp cận dự án qua ứng tuyển hoặc lời mời. MVP hỗ trợ tuyển chọn, trao đổi trong ứng dụng và ghi nhận việc hai bên cùng xác nhận bản tóm tắt thỏa thuận hợp tác. Quản lý thực hiện, bàn giao, nghiệm thu và thanh toán tiền thật nằm ngoài MVP; demo có thể mô phỏng trạng thái milestone/payment để kiểm thử luồng, không đại diện cho giao dịch tài chính thực.

Giá trị khác biệt dự kiến là gợi ý ứng viên phù hợp với Project Brief. MVP có thể bắt đầu bằng lọc và xếp hạng theo tiêu chí có giải thích; việc dùng AI thật và **AI Profile Evaluation** là hướng phát triển chưa cam kết. Hệ thống không tự quyết định việc hợp tác.

## 1.3 Đối tượng sử dụng tài liệu

- Nhóm FREVO (3 thành viên).
- Người thiết kế giao diện và trải nghiệm người dùng.
- Người phát triển/kiểm thử trong giai đoạn tiếp theo (nếu có).

## 1.4 Thuật ngữ

| **Thuật ngữ**         | **Ý nghĩa**                                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Business              | Đại diện doanh nghiệp tìm kiếm Freelancer để thực hiện dự án.                                                                          |
| ---                   | ---                                                                                                                                    |
| Freelancer            | Người làm việc tự do trong lĩnh vực sáng tạo.                                                                                          |
| ---                   | ---                                                                                                                                    |
| Team Freelancer       | Nhóm người làm tự do do một tài khoản Freelancer đại diện trong MVP; tài khoản đại diện thực hiện mọi thao tác trên FREVO.             |
| ---                   | ---                                                                                                                                    |
| Project Brief         | Bản mô tả có cấu trúc về mục tiêu, yêu cầu, ngân sách, thời hạn và sản phẩm bàn giao.                                                  |
| ---                   | ---                                                                                                                                    |
| Application           | Hồ sơ/đề xuất ứng tuyển do Freelancer chủ động gửi.                                                                                    |
| ---                   | ---                                                                                                                                    |
| Invitation            | Lời mời tham gia dự án do Business gửi đến Freelancer.                                                                                 |
| ---                   | ---                                                                                                                                    |
| AI Smart Matching     | Hướng phát triển dùng AI để gợi ý Freelancer phù hợp; MVP chỉ cam kết gợi ý theo tiêu chí, chưa cam kết dùng AI.                       |
| ---                   | ---                                                                                                                                    |
| AI Profile Evaluation | Công cụ hỗ trợ đối chiếu hồ sơ/CV/portfolio với yêu cầu dự án.                                                                         |
| ---                   | ---                                                                                                                                    |
| MVP                   | Phiên bản tối thiểu thể hiện giá trị cốt lõi của sản phẩm.                                                                             |
| ---                   | ---                                                                                                                                    |
| Freelance Marketplace | Nền tảng kết nối nhu cầu dự án và dịch vụ freelancer, có thể hỗ trợ cả quy trình hợp tác sau tuyển chọn.                               |
| ---                   | ---                                                                                                                                    |
| Project Workspace     | Khu vực hai bên theo dõi tiến độ, trao đổi và bàn giao công việc cho một dự án.                                                        |
| ---                   | ---                                                                                                                                    |
| Milestone             | Mốc công việc/sản phẩm bàn giao có thời hạn và trạng thái riêng.                                                                       |
| ---                   | ---                                                                                                                                    |
| Acceptance            | Việc Business xác nhận hoặc yêu cầu chỉnh sửa sản phẩm bàn giao.                                                                       |
| ---                   | ---                                                                                                                                    |
| Thỏa thuận hợp tác    | Bản tóm tắt phạm vi việc, sản phẩm bàn giao, thời hạn và ngân sách do hai bên xác nhận trên FREVO; không mặc định là hợp đồng điện tử. |
| ---                   | ---                                                                                                                                    |

## 1.5 Tài liệu tham chiếu

- Mô tả ý tưởng FREVO do nhóm cung cấp.
- ISO/IEC/IEEE 29148 (tham khảo cách tổ chức và đặc tả yêu cầu).

# 2\. Mô tả tổng quan hệ thống

## 2.1 Bối cảnh sản phẩm

FREVO dự kiến là nền tảng web responsive cho thị trường Việt Nam, gồm khu vực khám phá công khai và khu vực riêng cho Business/Freelancer. Vòng đời MVP: khám phá → ứng tuyển hoặc mời → Business xem xét và duyệt ứng viên → mở trao đổi → Business đề xuất bản tóm tắt thỏa thuận → Freelancer xác nhận → đóng tuyển và ghi nhận một đơn vị được chọn. Việc đóng tuyển không có nghĩa dự án đã hoàn thành. Thực hiện, bàn giao, nghiệm thu, đánh giá và thanh toán thuộc giai đoạn sau. Vai trò Admin nằm ngoài MVP.

## 2.2 Vấn đề cần giải quyết

- Doanh nghiệp mất thời gian tìm và so sánh Creative Freelancer từ nhiều nguồn.
- Thông tin năng lực và portfolio chưa được trình bày nhất quán.
- Người tuyển khó đối chiếu kỹ năng, ngân sách và lịch sẵn sàng với nhu cầu dự án.
- Freelancer cần cơ hội tiếp cận dự án phù hợp thay vì phụ thuộc hoàn toàn vào lời mời.
- Thiếu bằng chứng bàn giao và nghiệm thu để đối chiếu khi có tranh chấp.
- Nhu cầu phát triển sau MVP: lưu bằng chứng bàn giao và nghiệm thu theo từng mốc, hỗ trợ xử lý tranh chấp và thanh toán phần công việc đã được nghiệm thu. Các chức năng này chưa thuộc MVP.

## 2.3 Vai trò người dùng

| **Vai trò**  | **Quyền/hành vi chính**                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Guest        | Xem landing page, đăng ký, đăng nhập, khám phá dự án( chỉ xem).                                                                               |
| ---          | ---                                                                                                                                           |
| Business     | Đăng dự án, tìm/gợi ý Freelancer, duyệt ứng viên để trao đổi, đề xuất thỏa thuận và xác nhận lựa chọn.                                        |
| ---          | ---                                                                                                                                           |
| Freelancer   | Quản lý hồ sơ/portfolio, khám phá dự án, ứng tuyển, phản hồi lời mời, trao đổi và xác nhận hoặc từ chối thỏa thuận. Có thể đại diện cho team. |
| ---          | ---                                                                                                                                           |
| Admin \[P2\] | Quản lý người dùng, kiểm duyệt nội dung trong giai đoạn sau.                                                                                  |
| ---          | ---                                                                                                                                           |

## 2.4 Hướng tuyển dụng đã được nhóm xác nhận

**Luồng A – Business chủ động: Business công bố Project Brief và (có thể) chọn ưu tiên bên thực hiện (Cá nhân/Team/Both) → hệ thống gợi ý hồ sơ cá nhân/Team → Business xem hồ sơ và gửi lời mời → Freelancer hoặc người đại diện Team chấp nhận → hồ sơ ứng viên được tạo/cập nhật ở trạng thái chờ Business xem xét → Business duyệt hồ sơ → mở chat → trao đổi, đề xuất và xác nhận thỏa thuận hai phía.**

**Luồng B – Freelancer chủ động:** Business công bố dự án → Freelancer tìm kiếm → gửi đơn ứng tuyển với tư cách cá nhân hoặc đại diện Team → Business xem xét và duyệt hồ sơ → trao đổi → đề xuất và xác nhận thỏa thuận hai phía.

Hai luồng cùng dẫn đến một danh sách ứng viên. Một tài khoản Freelancer chỉ có một hồ sơ ứng viên cho mỗi dự án, kể cả khi vừa được mời vừa chủ động ứng tuyển. Hệ thống lưu các nguồn tiếp cận trên cùng hồ sơ và không tự đổi tư cách Cá nhân/Team đã chọn. Chấp nhận lời mời không tự mở chat; Business phải duyệt hồ sơ trước. Lời mời không đồng nghĩa với việc được chọn thực hiện dự án.

## 2.5 Phạm vi MVP đã thống nhất về định hướng

**Trong phạm vi P0:**

- Đăng ký, đăng nhập và phân quyền Business/Freelancer.
- Hỗ trợ hồ sơ cá nhân và hồ sơ Team để matching và ứng tuyển. Mỗi Team có một tài khoản đại diện - leader thực hiện các thao tác.
- Tạo, lưu nháp, đăng và quản lý Project Brief.
- Danh sách gợi ý Freelancer theo tiêu chí phù hợp có giải thích; chưa cam kết dùng AI thật.
- Mời Freelancer và nhận phản hồi.
- Tìm kiếm dự án và ứng tuyển.
- Quản lý ứng viên, gộp lời mời và đơn ứng tuyển, duyệt hồ sơ để mở kênh trao đổi.
- Hộp tin nhắn gắn với dự án cho Business và ứng viên đã được duyệt.
- Business đề xuất bản tóm tắt thỏa thuận; Freelancer xác nhận hoặc từ chối; thay đổi nội dung phải được xác nhận lại.
- Mỗi dự án chỉ chọn một đơn vị thực hiện: một Freelancer cá nhân hoặc một team do một tài khoản đại diện.
- Thông báo trong ứng dụng là kênh chính trong MVP; email notification có thể được bật cho các sự kiện quan trọng, tùy cấu hình và khả năng tích hợp dịch vụ gửi email.

Phạm vi mở rộng (P1 – đề xuất): AI Smart Matching thực sự và AI Profile Evaluation nếu nhóm xác định được cách triển khai/kiểm chứng; xác minh hồ sơ. Workspace, quản lý milestone, nộp sản phẩm, yêu cầu chỉnh sửa và nghiệm thu được mô tả như quy tắc nghiệp vụ mục tiêu cho giai đoạn sau MVP; bản demo có thể mô phỏng trạng thái thanh toán, nhưng không xử lý tiền thật.

Phạm vi giai đoạn sau (P2 – đề xuất): tích hợp thanh toán qua đối tác thứ ba phù hợp pháp lý; đánh giá/uy tín, lịch sử hợp tác và Admin. Việc mô phỏng thanh toán trong môi trường phát triển/demo không phải dịch vụ ký quỹ và không chứng minh tiền thật đã được nhận hoặc bảo vệ.

Ngoài MVP hiện tại: xử lý thanh toán tiền thật, ký quỹ thực tế, tạo/ký hợp đồng điện tử, xử lý tranh chấp có tính ràng buộc pháp lý, đánh giá, Admin và xác minh hồ sơ. Video/ảnh/tệp portfolio là nội dung portfolio cốt lõi; hỗ trợ video trong MVP theo giới hạn dung lượng, thời lượng và định dạng được cấu hình. Hai bên tự quyết định việc lập hợp đồng riêng; bản tóm tắt thỏa thuận trên FREVO chỉ ghi nhận nội dung hợp tác đã xác nhận và không mặc định là hợp đồng điện tử.

## 2.6 Giả định và phụ thuộc

- Chỉ dự án đã công bố mới được gửi lời mời hoặc nhận ứng tuyển.
- Một dự án chỉ chọn một đơn vị thực hiện; team sử dụng một tài khoản đại diện.
- Cách triển khai gợi ý ứng viên và quy tắc chi tiết của các tiêu chí còn cần thử nghiệm.

# 3\. Yêu cầu chức năng (Functional Requirements)

Mã FR được sử dụng để truy vết giữa yêu cầu, use case và thiết kế giao diện. Ưu tiên P0 thuộc MVP; P1/P2 là đề xuất ngoài MVP trừ khi phạm vi tại mục 2.5 được nhóm cập nhật. Các mã không xuất hiện trong bảng hiện tại không được tự suy diễn thành yêu cầu còn thiếu.

## 3.1 Xác thực và tài khoản

| **ID** | **Mô tả yêu cầu**                                                                           | **Vai trò**          | **Ưu tiên** | **Trạng thái** |
| ------ | ------------------------------------------------------------------------------------------- | -------------------- | ----------- | -------------- |
| FR-001 | Cho phép đăng ký tài khoản Freelance hoặc Business( ghi nhận thêm tên cty hoặc cá cá nhân). | Guest                | P0          | Dự thảo        |
| ---    | ---                                                                                         | ---                  | ---         | ---            |
| FR-002 | Cho phép đăng nhập và đăng xuất.                                                            | Business, Freelancer | P0          | Dự thảo        |
| ---    | ---                                                                                         | ---                  | ---         | ---            |
| FR-003 | Cho phép người dùng cập nhật thông tin tài khoản hợp lệ.                                    | Business, Freelancer | P0          | Dự thảo        |
| ---    | ---                                                                                         | ---                  | ---         | ---            |
| FR-004 | Giới hạn truy cập chức năng theo vai trò.                                                   | Hệ thống             | P0          | Dự thảo        |
| ---    | ---                                                                                         | ---                  | ---         | ---            |
| FR-005 | Cung cấp chức năng khôi phục mật khẩu.                                                      | Business, Freelancer | P1          | Dự thảo        |
| ---    | ---                                                                                         | ---                  | ---         | ---            |

## 3.2 Hồ sơ và Portfolio Freelancer

| **ID** | **Mô tả yêu cầu**                                                                                                                                                                            | **Vai trò** | **Ưu tiên** | **Trạng thái** |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------- | -------------- |
| FR-006 | Tạo và chỉnh sửa hồ sơ nghề nghiệp.                                                                                                                                                          | Freelancer  | P0          | Dự thảo        |
| ---    | ---                                                                                                                                                                                          | ---         | ---         | ---            |
| FR-007 | Quản lý kỹ năng và chuyên môn sáng tạo.                                                                                                                                                      | Freelancer  | P0          | Dự thảo        |
| ---    | ---                                                                                                                                                                                          | ---         | ---         | ---            |
| FR-008 | Thêm, sửa, xóa dự án trong portfolio<br><br>Portfolio phải thể hiện thuộc cá nhân hay Team. Khi cá nhân sử dụng dự án đã thực hiện cùng Team, phải ghi rõ vai trò và phần đóng góp của mình. | Freelancer  | P0          | Dự thảo        |
| ---    | ---                                                                                                                                                                                          | ---         | ---         | ---            |
| FR-010 | Hiển thị hồ sơ công khai được phép xem cho Business.                                                                                                                                         | Business    | P0          | Dự thảo        |
| ---    | ---                                                                                                                                                                                          | ---         | ---         | ---            |
| FR-011 | Cho phép tải lên CV tùy chọn để Business xem xét hồ sơ ứng viên.                                                                                                                             | Freelancer  | P0          | Đã chốt        |
| ---    | ---                                                                                                                                                                                          | ---         | ---         | ---            |

**Trường thông tin gợi ý:** tên hiển thị, tiêu đề nghề nghiệp, lĩnh vực, kỹ năng, giới thiệu, kinh nghiệm, mức phí, lịch sẵn sàng, các mục portfolio, CV tùy chọn và thiết lập quyền riêng tư. Freelancer có thể ghi mình làm độc lập hoặc đại diện team; MVP chỉ cấp quyền thao tác cho tài khoản đại diện. Business sở hữu dự án được xem CV khi người đó đã ứng tuyển hoặc chấp nhận lời mời vào dự án, để duyệt hồ sơ trước khi mở tin nhắn.

## 3.3 Quản lý Project Brief

| **ID** | **Mô tả yêu cầu**                                     | **Vai trò** | **Ưu tiên** | **Trạng thái** |
| ------ | ----------------------------------------------------- | ----------- | ----------- | -------------- |
| FR-012 | Tạo Project Brief theo cấu trúc biểu mẫu.             | Business    | P0          | Dự thảo        |
| ---    | ---                                                   | ---         | ---         | ---            |
| FR-013 | Lưu Project Brief dưới dạng bản nháp.                 | Business    | P0          | Dự thảo        |
| ---    | ---                                                   | ---         | ---         | ---            |
| FR-014 | Kiểm tra dữ liệu và công bố Project Brief hoàn chỉnh. | Business    | P0          | Dự thảo        |
| ---    | ---                                                   | ---         | ---         | ---            |
| FR-015 | Xem danh sách dự án của mình cùng trạng thái.         | Business    | P0          | Dự thảo        |
| ---    | ---                                                   | ---         | ---         | ---            |
| FR-016 | Chủ dự án có thể chỉnh sửa hoặc đóng dự án.           | Business    | P0          | Dự thảo        |
| ---    | ---                                                   | ---         | ---         | ---            |

**Trường thông tin gợi ý:** tiêu đề, lĩnh vực, mô tả, kỹ năng yêu cầu, kinh nghiệm mong muốn (không bắt buộc), loại/mức ngân sách, deadline, thời lượng, deliverables, file tham khảo (không bắt buộc), hạn ứng tuyển (không bắt buộc).

## 3.4 Gợi ý Freelancer và Invitation

| **ID** | **Mô tả yêu cầu**                                                                                                                                                                                                                     | **Vai trò** | **Ưu tiên** | **Trạng thái**     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------- | ------------------ |
| FR-017 | Giải thích các yếu tố gợi ý như kỹ năng, ngân sách, thời gian đáp ứng và các tiêu chí đã dùng để xếp hạng.                                                                                                                            | Business    | P0          | Đã chốt định hướng |
| ---    | ---                                                                                                                                                                                                                                   | ---         | ---         | ---                |
| FR-018 | Business được mở hồ sơ cá nhân hoặc Team từ danh sách gợi ý để xem năng lực và portfolio được phép công khai.                                                                                                                         | Business    | P0          | Dự thảo            |
| ---    | ---                                                                                                                                                                                                                                   | ---         | ---         | ---                |
| FR-019 | Gửi lời mời tham gia dự án đã công bố cho Freelancer hoặc người đại diện Team đủ điều kiện; lời mời hết hạn sau 7 ngày. Gửi lời mời không tự động duyệt hồ sơ để mở chat.                                                             | Business    | P0          | Đã chốt            |
| ---    | ---                                                                                                                                                                                                                                   | ---         | ---         | ---                |
| FR-020 | Cho phép Freelancer chấp nhận hoặc từ chối lời mời; nếu chấp nhận, hệ thống tạo/cập nhật một hồ sơ ứng viên ở trạng thái "Chờ Business xem xét".                                                                                      | Freelancer  | P0          | Đã chốt            |
| ---    | ---                                                                                                                                                                                                                                   | ---         | ---         | ---                |
| FR-021 | Hệ thống xếp hạng hồ sơ cá nhân/Team theo kỹ năng, kinh nghiệm và portfolio liên quan, mức phí dự kiến, trạng thái sẵn sàng và khả năng đáp ứng phạm vi dự án. Ưu tiên Cá nhân/Team chỉ hỗ trợ xếp hạng, không loại trừ loại còn lại. | Business    | P0          | Đã chốt định hướng |
| ---    | ---                                                                                                                                                                                                                                   | ---         | ---         | ---                |
| FR-022 | Cho phép Business lọc danh sách gợi ý theo các tiêu chí phù hợp có trong Project Brief và hồ sơ.                                                                                                                                      | Business    | P0          | Dự thảo            |
| ---    | ---                                                                                                                                                                                                                                   | ---         | ---         | ---                |

**Quy tắc: Freelancer chấp nhận lời mời hợp lệ sẽ được tạo/cập nhật hồ sơ ứng viên ở trạng thái "Chờ Business xem xét". Chat chỉ mở sau khi Business duyệt hồ sơ; việc chấp nhận lời mời không đồng nghĩa được chọn thực hiện dự án.**

## 3.5 Tìm dự án và ứng tuyển

| **ID** | **Mô tả yêu cầu**                                                                                                                                               | **Vai trò** | **Ưu tiên** | **Trạng thái** |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------- | -------------- |
| FR-023 | Hiển thị danh sách dự án đã công bố và còn nhận ứng tuyển.                                                                                                      | Freelancer  | P0          | Dự thảo        |
| ---    | ---                                                                                                                                                             | ---         | ---         | ---            |
| FR-024 | Tìm kiếm và lọc dự án.                                                                                                                                          | Freelancer  | P0          | Dự thảo        |
| ---    | ---                                                                                                                                                             | ---         | ---         | ---            |
| FR-025 | Xem chi tiết dự án và điều kiện ứng tuyển.                                                                                                                      | Freelancer  | P0          | Dự thảo        |
| ---    | ---                                                                                                                                                             | ---         | ---         | ---            |
| FR-026 | Freelancer gửi proposal, portfolio liên quan và chọn hồ sơ ứng tuyển: cá nhân hoặc Team do mình đại diện. Tư cách ứng tuyển phải được hiển thị rõ cho Business. | Freelancer  | P0          | Đã chốt        |
| ---    | ---                                                                                                                                                             | ---         | ---         | ---            |
| FR-027 | Theo dõi trạng thái ứng tuyển.                                                                                                                                  | Freelancer  | P0          | Dự thảo        |
| ---    | ---                                                                                                                                                             | ---         | ---         | ---            |
| FR-028 | Rút đơn ứng tuyển đang chờ xử lý.                                                                                                                               | Freelancer  | P1          | Dự thảo        |
| ---    | ---                                                                                                                                                             | ---         | ---         | ---            |

## 3.6 Duyệt ứng viên và lựa chọn

| **ID** | **Mô tả yêu cầu**                                                                                                                                                                                                                                                   | **Vai trò** | **Ưu tiên** | **Trạng thái** |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------- | -------------- |
| FR-029 | Xem các đơn ứng tuyển vào dự án do mình sở hữu.                                                                                                                                                                                                                     | Business    | P0          | Dự thảo        |
| ---    | ---                                                                                                                                                                                                                                                                 | ---         | ---         | ---            |
| FR-030 | Xem lời mời đã gửi và trạng thái phản hồi.                                                                                                                                                                                                                          | Business    | P0          | Dự thảo        |
| ---    | ---                                                                                                                                                                                                                                                                 | ---         | ---         | ---            |
| FR-031 | Business xem xét hồ sơ ứng viên và chọn duyệt hoặc từ chối. Chỉ hồ sơ được duyệt mới mở hộp tin nhắn gắn với dự án; việc chấp nhận lời mời không thay thế bước duyệt này.                                                                                           | Business    | P0          | Đã chốt        |
| ---    | ---                                                                                                                                                                                                                                                                 | ---         | ---         | ---            |
| FR-032 | Business đề xuất bản tóm tắt thỏa thuận cho một ứng viên; đề xuất hết hạn sau 3 ngày và chỉ ghi nhận hợp tác khi ứng viên xác nhận nội dung còn hiệu lực.                                                                                                           | Business    | P0          | Đã chốt        |
| ---    | ---                                                                                                                                                                                                                                                                 | ---         | ---         | ---            |
| FR-033 | Khi hai bên xác nhận thỏa thuận còn hiệu lực, hệ thống đóng tuyển, đánh dấu ứng viên được chọn và chuyển mọi hồ sơ còn lại sang "Không được chọn"; các lời mời/đề xuất đang chờ mất hiệu lực và các bên nhận thông báo. Đóng tuyển không đồng nghĩa dự án hoàn tất. | Hệ thống    | P0          | Đã chốt        |
| ---    | ---                                                                                                                                                                                                                                                                 | ---         | ---         | ---            |

## 3.7 AI Profile Evaluation – P1

| **ID** | **Mô tả yêu cầu**                                                                 | **Vai trò** | **Ưu tiên** | **Trạng thái** |
| ------ | --------------------------------------------------------------------------------- | ----------- | ----------- | -------------- |
| FR-034 | Hỗ trợ đối chiếu dữ liệu hồ sơ/CV/portfolio với yêu cầu dự án.                    | Business    | P1          | Dự thảo        |
| ---    | ---                                                                               | ---         | ---         | ---            |
| FR-035 | Nêu điểm mạnh, khoảng thiếu và bằng chứng đối chiếu; tránh kết luận thiếu căn cứ. | Business    | P1          | Dự thảo        |
| ---    | ---                                                                               | ---         | ---         | ---            |
| FR-036 | Hiển thị rõ kết quả AI chỉ mang tính tư vấn, cần người xem xét.                   | Business    | P1          | Dự thảo        |
| ---    | ---                                                                               | ---         | ---         | ---            |

## 3.8 Project Workspace và Reputation – P1/P2

| **ID** | **Mô tả yêu cầu**                                     | **Vai trò**          | **Ưu tiên** | **Trạng thái** |
| ------ | ----------------------------------------------------- | -------------------- | ----------- | -------------- |
| FR-037 | Tạo không gian quản lý dự án đã giao.                 | Business, Freelancer | P1          | Dự thảo        |
| ---    | ---                                                   | ---                  | ---         | ---            |
| FR-038 | Hỗ trợ gửi sản phẩm bàn giao và phản hồi.             | Business, Freelancer | P1          | Dự thảo        |
| ---    | ---                                                   | ---                  | ---         | ---            |
| FR-039 | Hiển thị mốc công việc/deadline.                      | Business, Freelancer | P1          | Dự thảo        |
| ---    | ---                                                   | ---                  | ---         | ---            |
| FR-040 | Cho phép Business có quyền xác nhận hoàn thành dự án. | Business             | P1          | Dự thảo        |
| ---    | ---                                                   | ---                  | ---         | ---            |
| FR-041 | Đánh giá Freelancer sau dự án hoàn thành.             | Business             | P2          | Dự thảo        |
| ---    | ---                                                   | ---                  | ---         | ---            |
| FR-042 | Hiển thị lịch sử uy tín được phép công khai.          | Business             | P2          | Dự thảo        |
| ---    | ---                                                   | ---                  | ---         | ---            |

## 3.9 Quản trị – P2

| **ID** | **Mô tả yêu cầu**                                       | **Vai trò** | **Ưu tiên** | **Trạng thái** |
| ------ | ------------------------------------------------------- | ----------- | ----------- | -------------- |
| FR-043 | Xem và quản lý tài khoản trong phạm vi phân quyền.      | Admin       | P2          | Dự thảo        |
| ---    | ---                                                     | ---         | ---         | ---            |
| FR-044 | Kiểm duyệt nội dung bị báo cáo hoặc vi phạm chính sách. | Admin       | P2          | Dự thảo        |
| ---    | ---                                                     | ---         | ---         | ---            |

## 3.10 Trao đổi và thỏa thuận hợp tác – P0

| **ID** | **Mô tả yêu cầu**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | **Vai trò**          | **Ưu tiên** | **Trạng thái** |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------- | -------------- |
| FR-045 | Chỉ mở hộp tin nhắn gắn với dự án sau khi Business duyệt hồ sơ ứng viên, dù hồ sơ phát sinh từ ứng tuyển hay lời mời đã được chấp nhận; Business và tài khoản Freelancer đại diện được xem.                                                                                                                                                                                                                                                                                                                 | Business, Freelancer | P0          | Đã chốt        |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ---                  | ---         | ---            |
| FR-046 | Cho phép hai bên gửi/xem tin nhắn và ghi nhận người gửi, thời điểm gửi trong phạm vi được cấp quyền.                                                                                                                                                                                                                                                                                                                                                                                                        | Business, Freelancer | P0          | Đã chốt        |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ---                  | ---         | ---            |
| FR-047 | Business tạo và gửi bản tóm tắt thỏa thuận gồm phạm vi công việc, sản phẩm bàn giao, thời hạn và ngân sách. Freelancer có thể xác nhận hoặc từ chối. Bản tóm tắt ghi nhận nội dung hai bên thống nhất trên FREVO, không mặc định là hợp đồng điện tử.                                                                                                                                                                                                                                                       | Business, Freelancer | P0          | Đã chốt        |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ---                  | ---         | ---            |
| FR-048 | Khi nội dung bản tóm tắt thỏa thuận thay đổi sau khi đã được Freelancer xác nhận, Business phải tạo phiên bản đề xuất mới và gửi Freelancer xác nhận lại. Hệ thống lưu các phiên bản, người thay đổi và thời điểm xác nhận; phiên bản cũ tiếp tục là phiên bản có hiệu lực cho đến khi phiên bản mới được hai bên xác nhận. Nếu phiên bản mới bị từ chối hoặc hết hạn, phiên bản mới không có hiệu lực và hai bên có thể tiếp tục trao đổi. Không gọi thay đổi này là "phụ lục hợp đồng" trong phạm vi MVP. | Hệ thống             | P0          | Đã chốt        |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ---                  | ---         | ---            |

## 3.10.1 Hỗ trợ team và thông báo trong MVP

| **ID** | **Mô tả yêu cầu**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | **Vai trò**          | **Ưu tiên** | **Trạng thái**                                                                                                      |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| FR-063 | Freelancer được quản lý hồ sơ cá nhân và hồ sơ Team do mình đại diện. Hồ sơ Team gồm tên, người đại diện, năng lực, thành viên và vai trò dự kiến, portfolio và trạng thái sẵn sàng. Trong MVP, tài khoản đại diện thực hiện các thao tác của Team; chưa có phân quyền riêng cho thành viên.                                                                                                                                                                                                                                                                                                                                                                                                         | Freelancer           | P0          | Đã chốt                                                                                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | ---                  | ---         | ---                                                                                                                 |
| FR-064 | Hệ thống phải tạo và hiển thị thông báo trong ứng dụng cho các sự kiện: có đơn ứng tuyển mới; Freelancer nhận lời mời; lời mời được chấp nhận, từ chối, hủy hoặc hết hạn; hồ sơ ứng viên được duyệt hoặc bị từ chối; có tin nhắn mới trong cuộc trao đổi mà người dùng có quyền truy cập; có đề xuất thỏa thuận mới hoặc thay đổi trạng thái xác nhận. Thông báo phải liên kết tới đối tượng nghiệp vụ tương ứng khi người dùng có quyền truy cập. Email notification có thể được bật trong MVP cho các sự kiện quan trọng đã được xác định và cấu hình. Lỗi gửi email không được làm gián đoạn thao tác nghiệp vụ chính và không được tiết lộ thông tin riêng tư cho người không có quyền truy cập. | Business, Freelancer | P0          | Kênh in-app thuộc MVP; email là kênh tùy chọn có thể bật trong MVP. Cần chốt sự kiện gửi email và cấu hình dịch vụ. |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | ---                  | ---         | ---                                                                                                                 |

## 3.11 Thực hiện, bàn giao và nghiệm thu – P1 \[ĐỀ XUẤT\]

| **ID** | **Mô tả yêu cầu**                                                                                                                             | **Vai trò**          | **Ưu tiên** | **Trạng thái** |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------- | -------------- |
| FR-049 | Hiển thị danh sách công việc/milestone và thời hạn của dự án đã giao.                                                                         | Business, Freelancer | P1          | Cần xác nhận   |
| ---    | ---                                                                                                                                           | ---                  | ---         | ---            |
| FR-050 | Freelancer có thể cập nhật tiến độ hoặc nộp liên kết/tệp bàn giao hợp lệ.                                                                     | Freelancer           | P1          | Cần xác nhận   |
| ---    | ---                                                                                                                                           | ---                  | ---         | ---            |
| FR-051 | Business có thể xem sản phẩm bàn giao và chọn chấp nhận hoặc yêu cầu chỉnh sửa kèm lý do.                                                     | Business             | P1          | Cần xác nhận   |
| ---    | ---                                                                                                                                           | ---                  | ---         | ---            |
| FR-052 | Hệ thống lưu trạng thái, thời điểm và lịch sử phiên bản bàn giao để hai bên tra cứu.                                                          | Hệ thống             | P1          | Cần xác nhận   |
| ---    | ---                                                                                                                                           | ---                  | ---         | ---            |
| FR-053 | Chỉ đánh dấu dự án hoàn tất khi tất cả milestone đã được hoàn thành theo quy tắc nghiệm thu theo hợp đồng đã được define và xác nhận từ 2 bên | Hệ thống             | P1          | Cần xác nhận   |
| ---    | ---                                                                                                                                           | ---                  | ---         | ---            |

## 3.12 Đánh giá sau hợp tác – P2 \[ĐỀ XUẤT\]

| **ID** | **Mô tả yêu cầu**                                                                           | **Vai trò**          | **Ưu tiên** | **Trạng thái** |
| ------ | ------------------------------------------------------------------------------------------- | -------------------- | ----------- | -------------- |
| FR-054 | Cho phép đánh giá sau khi hợp tác đã hoàn tất, theo tiêu chí và chính sách công bố đã chốt. | Business, Freelancer | P2          | Cần xác nhận   |
| ---    | ---                                                                                         | ---                  | ---         | ---            |
| FR-055 | Chỉ công khai phần đánh giá được phép hiển thị và có liên kết tới một hợp tác hợp lệ.       | Hệ thống             | P2          | Cần xác nhận   |
| ---    | ---                                                                                         | ---                  | ---         | ---            |

## 3.13 Thanh toán qua nhà cung cấp dịch vụ thứ ba – P2, ngoài MVP

**Quyết định của nhóm:** Thanh toán nằm ngoài MVP. Ở giai đoạn sau, FREVO định hướng tích hợp một đơn vị cung cấp dịch vụ thanh toán thứ ba được phép hoạt động, thay vì tự xây dựng hệ thống lưu giữ và luân chuyển tiền của khách hàng. Đơn vị cung cấp, luồng chuyển tiền, phí dịch vụ, chính sách hoàn tiền và cơ chế thanh toán cho Freelancer: **\[CẦN XÁC NHẬN\]**.

Định hướng sau MVP: Business thanh toán trước cho từng milestone đã thống nhất thông qua nhà cung cấp dịch vụ thanh toán thứ ba. Freelancer chỉ bắt đầu mốc đó khi hệ thống xác nhận khoản tiền đã được đối tác tiếp nhận theo cơ chế được phê duyệt. Sau khi Business nghiệm thu, hệ thống gửi yêu cầu giải ngân khoản tiền tương ứng cho Freelancer.

Định hướng sau MVP: Business không nhất thiết thanh toán toàn bộ giá trị dự án từ đầu. Việc triển khai phụ thuộc vào đối tác có hỗ trợ tiếp nhận tiền, chờ nghiệm thu và giải ngân theo từng milestone hay không.

**Giới hạn pháp lý:** Thanh toán qua bên thứ ba không tự động miễn nghĩa vụ thuế thu nhập cá nhân cho Freelancer và không tự động loại trừ trách nhiệm khấu trừ, kê khai hoặc nộp thay của FREVO nếu pháp luật áp dụng. Nghĩa vụ cụ thể phải được đánh giá theo tư cách pháp lý và vai trò của các bên, mô hình giao dịch và quy định tại thời điểm triển khai. Không mô tả tích hợp này là cơ chế tránh thuế.

**Luồng chính:**

**Luồng tham khảo sau MVP: Hai bên xác nhận kế hoạch milestone → Business thanh toán mốc 1 → đối tác xác nhận → Freelancer thực hiện → Business nghiệm thu → gửi yêu cầu giải ngân → tiếp tục mốc kế tiếp.**

| **ID** | **Mô tả yêu cầu**                                                                                                                                                                                                                                                                                  | **Vai trò**                  | **Ưu tiên** | **Trạng thái**                      |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------- | ----------------------------------- |
| FR-056 | Business có thể thanh toán trước cho từng milestone đã được hai bên xác nhận thông qua đối tác thanh toán. Hệ thống hiển thị giá trị mốc, phí áp dụng và tổng tiền cần trả trước khi Business xác nhận. Không bắt buộc thanh toán toàn bộ dự án.                                                   | Business                     | P2          | Đề xuất triển khai; mô hình đã chốt |
| ---    | ---                                                                                                                                                                                                                                                                                                | ---                          | ---         | ---                                 |
| FR-057 | FREVO xác thực kết quả thanh toán từ đối tác, đối chiếu đúng giao dịch, dự án và milestone. Thông báo lặp từ đối tác không được tạo thêm khoản thanh toán hoặc xử lý lại cùng giao dịch.                                                                                                           | Hệ thống                     | P2          | Đề xuất triển khai                  |
| ---    | ---                                                                                                                                                                                                                                                                                                | ---                          | ---         | ---                                 |
| FR-058 | Hai bên được xem số tiền và lịch sử giao dịch của từng milestone theo quyền truy cập. Hệ thống phân biệt rõ **đã thanh toán cho mốc**, **đã nghiệm thu**, **đang giải ngân** và **đã giải ngân thành công**; không ghi nhận thanh toán thành công chỉ dựa trên trang chuyển hướng của trình duyệt. | Business, Freelancer         | P2          | Đề xuất triển khai                  |
| ---    | ---                                                                                                                                                                                                                                                                                                | ---                          | ---         | ---                                 |
| FR-059 | Hệ thống xử lý thanh toán thất bại, bị hủy, đang chờ hoặc chưa nhận được phản hồi từ đối tác. Cho phép kiểm tra lại trạng thái và thanh toán lại khi phù hợp, đồng thời ngăn ghi nhận hoặc thu tiền trùng. Milestone chưa được xác nhận thanh toán không được chuyển sang thực hiện.               | Hệ thống                     | P2          | Đề xuất triển khai                  |
| ---    | ---                                                                                                                                                                                                                                                                                                | ---                          | ---         | ---                                 |
| FR-060 | Sau khi milestone được nghiệm thu và không có tranh chấp đang ngăn giải ngân, hệ thống gửi yêu cầu giải ngân số tiền tương ứng cho Freelancer qua đối tác. Chỉ ghi nhận **đã giải ngân** khi có kết quả xác thực từ đối tác; lưu lịch sử và xử lý lỗi mà không giải ngân trùng.                    | Hệ thống, đối tác thanh toán | P2          | Cần xác nhận                        |
| ---    | ---                                                                                                                                                                                                                                                                                                | ---                          | ---         | ---                                 |
| FR-061 | FREVO không thu thập hoặc lưu số thẻ, CVV, mật khẩu thanh toán; dữ liệu nhạy cảm do đối tác thanh toán xử lý theo phương án tích hợp.                                                                                                                                                              | Hệ thống                     | P2          | Đề xuất triển khai                  |
| ---    | ---                                                                                                                                                                                                                                                                                                | ---                          | ---         | ---                                 |
| FR-062 | Hệ thống có thể cung cấp dữ liệu giao dịch, báo cáo và thông tin đối soát cần thiết để đáp ứng nghĩa vụ kế toán/thuế áp dụng cho các chủ thể liên quan.                                                                                                                                            | Hệ thống, Admin              | P2          | Đề xuất triển khai                  |
| ---    | ---                                                                                                                                                                                                                                                                                                | ---                          | ---         | ---                                 |

**Chính sách cần phê duyệt trước triển khai:** phương án Business trả tiền trực tiếp cho Freelancer hay thông qua quy trình phân phối của đối tác; thời điểm thanh toán so với nghiệm thu; phí FREVO; hoàn/hủy; khiếu nại; biên nhận; trách nhiệm thuế và xử lý dữ liệu cá nhân. Không mặc định bên trung gian là đơn vị nộp thuế thay.

# 4\. Đặc tả Use Case

## UC-01 – Tạo và công bố Project Brief

| **Thuộc tính**  | **Nội dung**                      |
| --------------- | --------------------------------- |
| Actor chính     | Business                          |
| ---             | ---                               |
| Điều kiện trước | Business đã đăng nhập.            |
| ---             | ---                               |
| Kích hoạt       | Chọn "Tạo dự án".                 |
| ---             | ---                               |
| Điều kiện sau   | Dự án được lưu nháp hoặc công bố. |
| ---             | ---                               |
| FR liên quan    | FR-012 đến FR-016                 |
| ---             | ---                               |

**Luồng chính:**

1. Business mở trang tạo dự án.
2. Business chọn mức ưu tiên bên thực hiện: Cá nhân, Team hoặc cả hai/không ưu tiên. Lựa chọn này chỉ hỗ trợ xếp hạng gợi ý, không loại trừ quyền ứng tuyển của loại còn lại.
3. Hệ thống hiển thị biểu mẫu Project Brief.
4. Business nhập tiêu đề, lĩnh vực, mô tả, kỹ năng, ngân sách, deadline và deliverables.
5. Nếu Business không chọn ưu tiên, hệ thống lưu mặc định "Cả Cá nhân và Team"; lựa chọn này chỉ ảnh hưởng thứ tự gợi ý, không hạn chế ai được ứng tuyển.
6. Business chọn "Công bố".
7. Hệ thống kiểm tra dữ liệu.
8. Hệ thống lưu dự án với trạng thái "Đang tuyển".
9. Hệ thống hiển thị trang chi tiết dự án.

**Luồng thay thế/ngoại lệ:**

- A1: Thiếu trường bắt buộc → hiển thị thông báo tại trường tương ứng.
- A2: Chọn "Lưu nháp" → lưu mà không công bố.
- A3: Deadline/ngân sách không hợp lệ → hiển thị lỗi và giữ dữ liệu đã nhập.

## UC-02 – Gợi ý và mời Freelancer

| **Thuộc tính**    | **Nội dung**                                    |
| ----------------- | ----------------------------------------------- |
| Actor chính       | Business                                        |
| ---               | ---                                             |
| Thành phần hỗ trợ | Dịch vụ Matching                                |
| ---               | ---                                             |
| Điều kiện trước   | Có Project Brief hợp lệ theo quy tắc nhóm chốt. |
| ---               | ---                                             |
| Điều kiện sau     | Lời mời được tạo ở trạng thái "Chờ phản hồi".   |
| ---               | ---                                             |
| FR liên quan      | FR-017 đến FR-020, FR-022                       |
| ---               | ---                                             |

**Luồng chính:**

1. Business vào trang danh sách gợi ý Freelancer của dự án đã công bố.
2. Hệ thống hiển thị Freelancer/Team gợi ý và yếu tố phù hợp.
3. Business mở hồ sơ, kiểm tra portfolio.
4. Business nhấn "Mời tham gia dự án".
5. Hệ thống hiện xác nhận lời mời.
6. Business xác nhận; hệ thống tạo lời mời "Chờ phản hồi".
7. Freelancer có thể xem lời mời trong tài khoản; hệ thống gửi thông báo trong ứng dụng và có thể gửi email nếu email notification đã được cấu hình cho sự kiện này.

**Ngoại lệ:** Không có kết quả → hiển thị trạng thái trống; đã gửi lời mời → ngăn gửi trùng; dự án chưa công bố hoặc đã đóng → không cho gửi lời mời.

## UC-03 – Freelancer ứng tuyển dự án

| **Thuộc tính**  | **Nội dung**                                                                                |
| --------------- | ------------------------------------------------------------------------------------------- |
| Actor chính     | Freelancer                                                                                  |
| ---             | ---                                                                                         |
| Điều kiện trước | Đã đăng nhập; dự án đã công bố và còn nhận ứng tuyển.<br><br>**Freelancer đã có portfolio** |
| ---             | ---                                                                                         |
| Điều kiện sau   | Đơn ứng tuyển được lưu ở trạng thái "Đã gửi".                                               |
| ---             | ---                                                                                         |
| FR liên quan    | FR-023 đến FR-027                                                                           |
| ---             | ---                                                                                         |

**Luồng chính:**

1. Freelancer mở danh sách dự án.
2. Freelancer tìm/lọc và chọn dự án.
3. Hệ thống hiển thị chi tiết và điều kiện ứng tuyển.
4. Freelancer chọn tư cách ứng tuyển là hồ sơ cá nhân hoặc Team do mình đại diện, nhập proposal và chọn portfolio liên quan.
5. Freelancer nhấn "Ứng tuyển".
6. Freelancer rà soát thông tin và xác nhận gửi ứng tuyển.
7. Hệ thống tạo đơn "Đã gửi" và hiển thị trạng thái cho Freelancer và Business.

**Ngoại lệ:** Đã có hồ sơ ứng viên → cập nhật cùng hồ sơ, không tạo hồ sơ thứ hai; dự án đóng → vô hiệu hóa nút; thiếu dữ liệu → báo lỗi.

## UC-04 – Phản hồi lời mời

- **Actor:** Freelancer.
- **Điều kiện trước:** Có lời mời ở trạng thái chờ phản hồi.
- **Luồng chính: Freelancer mở lời mời → xem dự án và thời hạn phản hồi → chọn "Chấp nhận" hoặc "Từ chối" → hệ thống kiểm tra lời mời còn hiệu lực và dự án còn mở → cập nhật trạng thái lời mời. Nếu chấp nhận, hệ thống tạo/cập nhật một hồ sơ ứng viên ở trạng thái "Chờ Business xem xét" và thông báo cho Business; chat chỉ mở sau khi Business duyệt hồ sơ.** Mở danh sách lời mời → xem chi tiết → chọn "Chấp nhận" hoặc "Từ chối" → xác nhận → hệ thống cập nhật trạng thái; khi chấp nhận, tạo/cập nhật một hồ sơ ứng viên của dự án.
- **Ngoại lệ:** Lời mời hết hạn, dự án đã đóng hoặc Business hủy lời mời → không thể chấp nhận lời mời đó.
- **Điều kiện sau:** Lời mời có trạng thái mới; chấp nhận chưa mở hộp tin nhắn và chưa đồng nghĩa được tuyển.

## UC-05 – Xem xét và duyệt ứng viên để trao đổi

- **Actor:** Business.
- **Điều kiện trước:** Dự án có ứng viên hoặc lời mời đã phản hồi.
- **Luồng chính: Mở danh sách hồ sơ ứng viên ở trạng thái "Chờ Business xem xét" → xem hồ sơ/portfolio/CV được phép truy cập → chọn duyệt hoặc từ chối theo chính sách ứng viên của MVP → hệ thống cập nhật trạng thái và thông báo cho Freelancer. Chỉ khi Business duyệt, hệ thống mới mở hộp tin nhắn gắn với dự án.**
- **Ngoại lệ: Ứng viên đã rút hồ sơ, dự án đã đóng tuyển hoặc đã có đơn vị được chọn thì không thể được duyệt. Nếu hồ sơ có cả nguồn ứng tuyển và lời mời, hồ sơ vẫn chỉ xuất hiện một lần và lưu cả hai nguồn; không ưu tiên nguồn nào để quyết định quyền chat.**
- **Điều kiện sau: Hồ sơ được duyệt chuyển sang "Được duyệt trao đổi" và hai bên được nhắn tin trong dự án; nếu Business từ chối hồ sơ, trạng thái chuyển sang "Không được chọn" và không mở chat.**

## UC-06 – Đề xuất và xác nhận thỏa thuận

- **Actor:** Business và Freelancer (hoặc tài khoản đại diện team).
- **Điều kiện trước:** Ứng viên đã được duyệt trao đổi; dự án chưa đóng và chưa có đơn vị thực hiện được xác nhận.
- **Luồng chính: Hai bên trao đổi qua hộp tin nhắn → Business tạo bản tóm tắt thỏa thuận gồm phạm vi công việc, sản phẩm bàn giao, thời hạn và ngân sách → Freelancer xem và xác nhận hoặc từ chối → hệ thống lưu phiên bản và thời điểm xác nhận của từng bên. Đây là bản tóm tắt thỏa thuận trên nền tảng, không mặc định là hợp đồng điện tử.**
- **Ngoại lệ: Freelancer từ chối hoặc đề xuất hết hạn → phiên bản đó không có hiệu lực và hai bên có thể tiếp tục trao đổi để tạo đề xuất mới. Business thay đổi bất kỳ nội dung nào sau khi Freelancer đã xác nhận phải tạo phiên bản mới và yêu cầu xác nhận lại. Dự án đã đóng tuyển hoặc đã bị hủy thì không cho xác nhận thêm.**
- **Điều kiện sau: Dự án chuyển sang "Đã đóng tuyển" và có đúng một đơn vị được chọn; các hồ sơ còn lại chuyển sang "Không được chọn", các lời mời/đề xuất đang chờ mất hiệu lực. Hệ thống lưu phiên bản thỏa thuận được hai bên xác nhận. "Đã đóng tuyển" không có nghĩa dự án đã hoàn thành hoặc đã thanh toán.**

## UC-07 – Theo dõi và bàn giao dự án \[ĐỀ XUẤT, P1\]

| **Thuộc tính**  | **Nội dung**                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Actor chính     | Freelancer                                                                                                                     |
| ---             | ---                                                                                                                            |
| Điều kiện trước | Có hợp tác được xác nhận và quyền truy cập Workspace hợp lệ.                                                                   |
| ---             | ---                                                                                                                            |
| Kích hoạt       | Freelancer mở Workspace và chọn bàn giao.                                                                                      |
| ---             | ---                                                                                                                            |
| Luồng chính     | Xem milestone → chọn mục cần bàn giao → đính kèm tệp/liên kết → gửi → hệ thống kiểm tra và ghi nhận trạng thái chờ nghiệm thu. |
| ---             | ---                                                                                                                            |
| Ngoại lệ        | Tệp không hợp lệ, thiếu dữ liệu, dự án bị hủy hoặc không có quyền.                                                             |
| ---             | ---                                                                                                                            |
| Điều kiện sau   | Business có thể xem phiên bản bàn giao hợp lệ.                                                                                 |
| ---             | ---                                                                                                                            |
| FR liên quan    | FR-037 đến FR-039, FR-049, FR-050, FR-052                                                                                      |
| ---             | ---                                                                                                                            |

## UC-08 – Nghiệm thu hoặc yêu cầu chỉnh sửa \[ĐỀ XUẤT, P1\]

| **Thuộc tính**  | **Nội dung**                                                                                                                                                                                                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actor chính     | Business                                                                                                                                                                                                                                                                                      |
| ---             | ---                                                                                                                                                                                                                                                                                           |
| Điều kiện trước | Có sản phẩm bàn giao đang chờ xem xét của dự án do Business sở hữu.<br><br>**Tiêu chí nghiệm thu đã thống nhất** trước.                                                                                                                                                                       |
| ---             | ---                                                                                                                                                                                                                                                                                           |
| Luồng chính     | **Mở bàn giao và xem tiêu chí nghiệm thu → chọn chấp nhận hoặc yêu cầu chỉnh sửa với lỗi cụ thể và căn cứ → bên bàn giao phản hồi hoặc thực hiện chỉnh sửa → hệ thống lưu lịch sử, thông báo cho hai bên và cập nhật trạng thái. Yêu cầu ngoài phạm vi được chuyển sang quy trình thay đổi.** |
| ---             | ---                                                                                                                                                                                                                                                                                           |
| Điều kiện sau   | Bản bàn giao được nghiệm thu hoặc được chuyển về trạng thái cần chỉnh sửa.                                                                                                                                                                                                                    |
| ---             | ---                                                                                                                                                                                                                                                                                           |
| FR liên quan    | FR-051 đến FR-053                                                                                                                                                                                                                                                                             |
| ---             | ---                                                                                                                                                                                                                                                                                           |

## UC-09 – Đánh giá sau hoàn tất \[ĐỀ XUẤT, P2\]

| **Thuộc tính**  | **Nội dung**                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Actor chính     | Business hoặc Freelancer, tùy chính sách đánh giá được duyệt                                    |
| ---             | ---                                                                                             |
| Điều kiện trước | Hợp tác thỏa điều kiện đánh giá và người dùng chưa gửi đánh giá bị cấm trùng.                   |
| ---             | ---                                                                                             |
| Luồng chính     | Mở hợp tác đã hoàn tất → nhập đánh giá → xác nhận → hệ thống lưu và áp dụng chính sách công bố. |
| ---             | ---                                                                                             |
| Điều kiện sau   | Đánh giá được lưu; khả năng hiển thị tuân thủ quyền riêng tư.                                   |
| ---             | ---                                                                                             |
| FR liên quan    | FR-054, FR-055                                                                                  |
| ---             | ---                                                                                             |

# 5\. Quy tắc nghiệp vụ (Business Rules)

| **ID** | **Quy tắc**                                                                                                                                                                                                                                                                                                                                                                                                      | **Trạng thái**                                      |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| BR-001 | Chỉ Business được tạo và công bố dự án.                                                                                                                                                                                                                                                                                                                                                                          | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-002 | Chỉ Freelancer hoặc tài khoản đại diện Team được gửi hồ sơ ứng tuyển; thành viên không có tài khoản đại diện không thao tác độc lập trong MVP.                                                                                                                                                                                                                                                                   | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-003 | Mỗi tài khoản Freelancer chỉ có một hồ sơ ứng viên cho mỗi dự án, hoặc gắn với một tư cách cá nhân hoặc một Team cụ thể.                                                                                                                                                                                                                                                                                         | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-004 | Business không được gửi nhiều lời mời đang hoạt động cho cùng một tài khoản Freelancer đại diện trong cùng dự án.                                                                                                                                                                                                                                                                                                | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-005 | Khi Freelancer chấp nhận lời mời hợp lệ, hệ thống tạo/cập nhật hồ sơ ứng viên theo đúng tư cách Cá nhân/Team được mời và chuyển hồ sơ sang "Chờ Business xem xét". Chấp nhận lời mời không tự mở chat và không đồng nghĩa được chọn thực hiện dự án.                                                                                                                                                             | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-006 | Chỉ Business sở hữu dự án được duyệt hoặc từ chối hồ sơ ứng viên và gửi đề xuất thỏa thuận. Việc gửi lời mời và việc Freelancer chấp nhận lời mời không thay thế quyết định duyệt hồ sơ.                                                                                                                                                                                                                         | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-007 | Dự án đã đóng tuyển hoặc đã hủy không nhận lời mời hay đơn ứng tuyển mới.                                                                                                                                                                                                                                                                                                                                        | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-008 | Gợi ý của hệ thống không tự động phê duyệt, từ chối hay tuyển Freelancer.                                                                                                                                                                                                                                                                                                                                        | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-009 | Mỗi dự án có tối đa một đơn vị thực hiện: một Freelancer cá nhân hoặc một team do một tài khoản đại diện.                                                                                                                                                                                                                                                                                                        | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-010 | Freelancer có thể ứng tuyển mà không cần được hệ thống gợi ý trước.                                                                                                                                                                                                                                                                                                                                              | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-011 | Khi cùng tài khoản vừa ứng tuyển vừa nhận lời mời cho một dự án, hệ thống giữ một hồ sơ ứng viên và thông tin của cả hai nguồn. Không tự động thay đổi tư cách cá nhân/Team đã ghi nhận.                                                                                                                                                                                                                         | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-012 | CV chỉ Business sở hữu dự án mà Freelancer đã ứng tuyển hoặc đã chấp nhận lời mời được xem để duyệt hồ sơ; thông tin riêng tư khác tuân theo quyền truy cập.                                                                                                                                                                                                                                                     | Đã chốt định hướng                                  |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-013 | Chỉ Business sở hữu dự án và tài khoản Freelancer đại diện của hồ sơ ứng viên được truy cập hộp chat tương ứng. Hộp chat chỉ mở sau khi Business duyệt hồ sơ, bất kể hồ sơ đến từ ứng tuyển hay lời mời đã chấp nhận. Workspace và bàn giao không thuộc MVP.                                                                                                                                                     | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-014 | Chỉ áp dụng cho giai đoạn sau MVP: Business có thể chấp nhận bàn giao hoặc yêu cầu chỉnh sửa đối với bàn giao đang chờ nghiệm thu. Yêu cầu chỉnh sửa phải nêu tiêu chí đã thống nhất chưa đạt và phần cần sửa; thay đổi ngoài phạm vi phải được hai bên thống nhất riêng.                                                                                                                                        | Ngoài MVP – cần xác nhận                            |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-015 | Bản tóm tắt thỏa thuận được hai bên xác nhận chỉ ghi nhận nội dung hợp tác trên FREVO; không tự động đồng nghĩa dự án đã hoàn tất, đã thanh toán hoặc đã tạo/ký hợp đồng điện tử.                                                                                                                                                                                                                                | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-016 | Quyền đánh giá chỉ được mở ở giai đoạn sau khi nhóm xác định rõ điều kiện hoàn tất hợp tác và chính sách đánh giá.                                                                                                                                                                                                                                                                                               | Ngoài MVP – cần xác nhận                            |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-017 | Mọi giao dịch thanh toán tích hợp FREVO phải được xử lý qua đối tác thanh toán thứ ba theo mô hình nhóm đã thống nhất; không tự lưu giữ tiền hoặc dữ liệu thẻ nhạy cảm khi chưa có căn cứ pháp lý và thiết kế được duyệt.                                                                                                                                                                                        | Đã chốt nguyên tắc                                  |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-018 | Chỉ công nhận thanh toán thành công sau khi xác thực kết quả từ đối tác và đối soát mã giao dịch; callback lặp không tạo thêm khoản thanh toán.                                                                                                                                                                                                                                                                  | Đề xuất                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-019 | Việc dùng đối tác thanh toán không phải căn cứ miễn thuế thu nhập cá nhân; các nghĩa vụ pháp lý áp dụng phải được xác định riêng trước vận hành thực tế.                                                                                                                                                                                                                                                         | Ràng buộc tuân thủ                                  |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-020 | Chỉ dự án đã công bố mới được gửi lời mời hoặc nhận đơn ứng tuyển.                                                                                                                                                                                                                                                                                                                                               | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-021 | Business sửa nội dung bản tóm tắt sau khi Freelancer đã xác nhận thì phải yêu cầu xác nhận lại; nếu Freelancer từ chối, hồ sơ trở về trạng thái trao đổi.                                                                                                                                                                                                                                                        | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-022 | MVP không tạo hoặc ký hợp đồng điện tử; hai bên tự quyết định việc lập hợp đồng riêng. Bản tóm tắt thỏa thuận trên FREVO không mặc định là hợp đồng điện tử.                                                                                                                                                                                                                                                     | Đã chốt định hướng                                  |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-023 | Khi hai bên xác nhận thỏa thuận còn hiệu lực, hệ thống chuyển dự án sang "Đã đóng tuyển". Ứng viên được chọn giữ trạng thái "Đã được chọn"; các ứng viên còn lại chuyển sang "Không được chọn". Lời mời và đề xuất thỏa thuận đang chờ mất hiệu lực. Hệ thống phải ngăn xác nhận thành công nhiều thỏa thuận cho cùng dự án, kể cả khi thao tác xảy ra đồng thời. Đóng tuyển không có nghĩa dự án đã hoàn thành. | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-024 | Lời mời hết hạn sau 7 ngày; đề xuất thỏa thuận hết hạn sau 3 ngày kể từ khi gửi. Quá hạn thì không thể chấp nhận nội dung cũ; Business có thể gửi lại nếu dự án vẫn đang tuyển và chưa bị hủy.                                                                                                                                                                                                                   | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-025 | Định hướng sau MVP: một Project Agreement chứa nhiều milestone; mỗi milestone có deliverables, tiêu chí nghiệm thu, hạn, số tiền và số vòng chỉnh sửa. Business funding từng milestone trước khi bắt đầu; chỉ giải ngân sau nghiệm thu hoặc quyết định tranh chấp theo chính sách. Thay đổi phải được hai bên xác nhận. Demo chỉ mô phỏng trạng thái, không xử lý tiền thật.                                     | Định hướng sau MVP; mô phỏng có thể dùng trong demo |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-026 | Ưu tiên cá nhân/Team là tùy chọn hỗ trợ xếp hạng, không phải điều kiện loại hồ sơ. Cả hai loại vẫn được ứng tuyển.                                                                                                                                                                                                                                                                                               | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-027 | Matching sử dụng năng lực của đúng hồ sơ cá nhân hoặc proposal của Team. Thành tích Team không tự động được tính toàn bộ cho từng thành viên; đóng góp cá nhân phải được ghi rõ. Thông tin khai báo chưa xác minh không được trình bày là đã xác minh.                                                                                                                                                           | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |
| BR-028 | Mỗi hồ sơ Team chỉ xuất hiện một lần trong một danh sách gợi ý. Thành viên của Team vẫn có thể được gợi ý riêng với tư cách cá nhân theo năng lực của họ. Quan hệ với Team được hiển thị khi hệ thống có dữ liệu liên kết.                                                                                                                                                                                       | Đã chốt                                             |
| ---    | ---                                                                                                                                                                                                                                                                                                                                                                                                              | ---                                                 |

## 5.1 Trạng thái nghiệp vụ

- **Trạng thái dự án MVP: Bản nháp → Đang tuyển → Đã đóng tuyển khi một thỏa thuận được xác nhận; dự án có thể chuyển sang Đã hủy theo chính sách hủy được nhóm phê duyệt. Không dùng trạng thái "Đã hoàn thành" trong MVP. "Đã đóng tuyển" chỉ kết thúc việc tìm/chọn người thực hiện, không xác nhận hoàn tất công việc.**
- **Trạng thái hồ sơ ứng viên MVP: Chờ Business xem xét → Được duyệt trao đổi → Đang trao đổi → Chờ Freelancer xác nhận thỏa thuận → Đã được chọn; hoặc chuyển sang Không được chọn/Đã rút theo hành động hợp lệ. Hồ sơ bị Business từ chối trước khi trao đổi chuyển sang Không được chọn. Sau khi dự án đóng tuyển, các hồ sơ chưa được chọn không thể tiếp tục quy trình tuyển.**
- **Trạng thái lời mời: Chờ phản hồi → Đã chấp nhận/Từ chối/Hết hạn/Đã hủy. Chấp nhận lời mời tạo/cập nhật hồ sơ ứng viên ở trạng thái chờ Business xem xét; không tự mở chat.**
- **Trạng thái đề xuất thỏa thuận: Chờ phản hồi → Đã xác nhận/Từ chối/Hết hạn/Đã thay thế bởi phiên bản mới. Chỉ phiên bản còn hiệu lực được xác nhận; mọi sửa đổi sau xác nhận phải được hai bên xác nhận lại.**
- **Bàn giao \[ĐỀ XUẤT\]:** Chưa gửi → Chờ nghiệm thu → Cần chỉnh sửa/Được chấp nhận.
- **Hợp tác sau MVP \[ĐỀ XUẤT\]:** Đang thực hiện → Chờ nghiệm thu → Hoàn tất/Đã hủy.

Các trạng thái MVP nêu trên là chuẩn dùng cho yêu cầu và use case. Trạng thái bàn giao/nghiệm thu, hoàn tất hợp tác và thanh toán chỉ áp dụng ở giai đoạn sau khi nhóm phê duyệt phạm vi tương ứng.

# 6\. Yêu cầu phi chức năng (Non-functional Requirements)

| **ID** | **Nhóm**          | **Mục tiêu đề xuất**                                                                                                                                                                          | **Cách kiểm tra**                                                                                                             |
| ------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| NFR-01 | Dễ sử dụng        | Các luồng cốt lõi (đăng ký/đăng nhập, tạo brief, ứng tuyển, duyệt ứng viên, chat, xác nhận thỏa thuận) hoàn thành được trên desktop và viewport mobile mục tiêu mà không mất chức năng chính. | Kiểm thử từng luồng trên ít nhất một viewport desktop và một viewport mobile đã xác định trước khi nghiệm thu.                |
| ---    | ---               | ---                                                                                                                                                                                           | ---                                                                                                                           |
| NFR-02 | Khả năng tiếp cận | Các thành phần cốt lõi có nhãn phù hợp, điều hướng bàn phím và trạng thái focus nhìn thấy được; hướng đến WCAG 2.2 AA.                                                                        | Kiểm tra bàn phím thủ công và công cụ đánh giá tự động; ghi nhận các lỗi nghiêm trọng trước nghiệm thu.                       |
| ---    | ---               | ---                                                                                                                                                                                           | ---                                                                                                                           |
| NFR-03 | Hiệu năng         | Mục tiêu đề xuất: 95% yêu cầu API thông thường phản hồi trong 2 giây hoặc ít hơn dưới tải kiểm thử đã thống nhất; loại trừ tác vụ ngoài hệ thống như gửi email.                               | Báo cáo kiểm thử nêu môi trường, dữ liệu, tải đồng thời và phân vị phản hồi; nhóm cần chốt tải kiểm thử trước khi nghiệm thu. |
| ---    | ---               | ---                                                                                                                                                                                           | ---                                                                                                                           |
| NFR-04 | Bảo mật           | Mọi API/thao tác đọc hoặc sửa dữ liệu riêng tư phải kiểm tra đăng nhập, vai trò và quyền sở hữu ở phía máy chủ; từ chối truy cập không hợp lệ.                                                | Kiểm thử tích hợp các trường hợp đúng quyền/sai quyền cho từng vai trò.                                                       |
| ---    | ---               | ---                                                                                                                                                                                           | ---                                                                                                                           |
| NFR-05 | Riêng tư          | CV, tin nhắn, proposal và thỏa thuận không được trả về cho người không có quyền truy cập theo vai trò và quyền sở hữu dự án.                                                                  | Kiểm thử truy cập trái phép bằng tài khoản khác và kiểm tra phản hồi API.                                                     |
| ---    | ---               | ---                                                                                                                                                                                           | ---                                                                                                                           |
| NFR-06 | Tin cậy           | Khi biểu mẫu thất bại hoặc dữ liệu không hợp lệ, hệ thống hiển thị lỗi có thể hiểu được và giữ lại dữ liệu không nhạy cảm đã nhập; tệp không giữ được phải được yêu cầu tải lại.              | Kiểm thử lỗi xác thực, lỗi mạng và lỗi tải tệp; xác nhận dữ liệu đã nhập còn được giữ.                                        |
| ---    | ---               | ---                                                                                                                                                                                           | ---                                                                                                                           |
| NFR-07 | Minh bạch gợi ý   | Giao diện phải nêu các tiêu chí dùng để xếp hạng/gợi ý; không gọi là AI nếu MVP dùng quy tắc lọc/xếp hạng thông thường.                                                                       | Đối chiếu giao diện và nội dung mô tả matching với thuật toán thực tế được triển khai.                                        |
| ---    | ---               | ---                                                                                                                                                                                           | ---                                                                                                                           |
| NFR-08 | Toàn vẹn dữ liệu  | Không tạo hồ sơ ứng viên trùng theo cặp dự án–tài khoản đại diện; không cho xác nhận nhiều đơn vị thực hiện cho một dự án.                                                                    | Kiểm thử API và tình huống hai thao tác xác nhận xảy ra đồng thời.                                                            |
| ---    | ---               | ---                                                                                                                                                                                           | ---                                                                                                                           |
| NFR-09 | Truy vết sự kiện  | Truy vết thay đổi trạng thái hồ sơ ứng viên, lời mời và thỏa thuận trong MVP; bàn giao/nghiệm thu chỉ áp dụng sau MVP.                                                                        | Kiểm tra người thực hiện, thời điểm và trạng thái trước/sau được lưu cho các sự kiện MVP.                                     |
| ---    | ---               | ---                                                                                                                                                                                           | ---                                                                                                                           |
| NFR-10 | Bảo vệ tệp        | Kiểm tra định dạng, kích thước và quyền truy cập CV/portfolio; giới hạn dung lượng cụ thể cần được nhóm chốt trước khi phát triển tải tệp.                                                    | Kiểm thử định dạng hợp lệ/không hợp lệ, vượt dung lượng và truy cập tệp trái phép.                                            |
| ---    | ---               | ---                                                                                                                                                                                           | ---                                                                                                                           |

**Lưu ý:** Các ngưỡng định lượng là yêu cầu dự kiến và cần được xác nhận.

# 7\. Yêu cầu giao diện người dùng

## 7.1 Điều hướng theo vai trò

- **Khách:** Landing Page, Đăng nhập, Đăng ký.
- **Business:** Dashboard, Dự án của tôi, Tạo brief, Gợi ý Freelancer, Quản lý ứng viên, Hồ sơ Freelancer, Tin nhắn, Thỏa thuận, Thông báo, Cài đặt; \[P1\] Workspace/nghiệm thu; \[P2\] đánh giá và thanh toán.
- **Freelancer:** Dashboard, Hồ sơ/Portfolio, Tìm dự án, Đơn ứng tuyển của tôi, Lời mời, Tin nhắn, Thỏa thuận, Thông báo, Cài đặt; \[P1\] Workspace/bàn giao; \[P2\] đánh giá và thanh toán.

## 7.2 Thành phần giao diện dùng chung

- Navigation/topbar/sidebar tương ứng vai trò.
- DInput, textarea, chọn nhiều kỹ năng, ngày, ngân sách.
- Project Card, Freelancer Card, nhãn trạng thái.
- Tìm kiếm, bộ lọc, modal xác nhận.
- Thông báo lỗi/thành công, trạng thái trống, loading.
- Preview portfolio và file đính kèm.
- Hộp tin nhắn theo dự án, bản tóm tắt thỏa thuận và trạng thái xác nhận của hai bên.
- \[SAU MVP\] Timeline thực hiện, milestone, trạng thái nghiệm thu và giao dịch.

# 8\. Yêu cầu giao diện ngoài và dữ liệu

## 8.1 Giao diện phần mềm bên ngoài

- Hệ thống cần giao diện web cho Business và Freelancer.
- MVP có thể tính gợi ý theo tiêu chí nội bộ; nhà cung cấp hoặc mô hình AI cho giai đoạn sau: **\[CẦN XÁC NHẬN\]**.
- MVP hỗ trợ thông báo trong ứng dụng. Email notification có thể được bật cho các sự kiện quan trọng thông qua dịch vụ gửi email bên ngoài. Nếu email được bật, lỗi gửi email không được làm gián đoạn thao tác nghiệp vụ chính; hệ thống cần ghi nhận lỗi và cho phép thử lại hoặc xử lý lại theo cấu hình. Danh sách sự kiện gửi email, mẫu nội dung và cấu hình dịch vụ phải được xác nhận trước khi triển khai.

## 8.2 Dữ liệu đầu vào chính

- **Hồ sơ Freelancer:** thông tin nghề nghiệp, kỹ năng, kinh nghiệm, portfolio, CV tùy chọn, trạng thái sẵn sàng, lựa chọn làm độc lập hoặc đại diện team.
- **Hồ sơ Team:** mã Team, tên, tài khoản đại diện, năng lực, thành viên và vai trò, portfolio, mức phí dự kiến và trạng thái sẵn sàng. Liên kết thành viên và thông tin xác minh được lưu khi có.
- **Project Brief:** tiêu đề, mô tả, danh mục, kỹ năng yêu cầu, ngân sách, thời hạn và sản phẩm bàn giao.
- **Hồ sơ ứng viên: dự án, tài khoản Freelancer đại diện, tư cách ứng tuyển (Cá nhân/Team), nguồn ứng tuyển/lời mời, proposal, portfolio liên quan, thời điểm và trạng thái; duy nhất theo cặp dự án–tài khoản Freelancer đại diện. Nếu có nhiều nguồn, lưu nhiều nguồn trên cùng một hồ sơ.**
- **Invitation:** dự án, Business, Freelancer, nội dung lời mời, thời điểm và trạng thái.
- **Thỏa thuận MVP: dự án, Business, tài khoản Freelancer đại diện, phiên bản nội dung tóm tắt, phạm vi công việc, deliverables, deadline, ngân sách, thời điểm và trạng thái xác nhận của từng bên. Bản tóm tắt không mặc định là hợp đồng điện tử.**
- **Milestone/Deliverable \[ĐỀ XUẤT\]:** dự án, tên, hạn, mô tả, tệp/liên kết, phiên bản và trạng thái nghiệm thu.
- **Review \[ĐỀ XUẤT\]:** hợp tác, người đánh giá, người được đánh giá, nội dung và trạng thái công khai.
- **Payment \[SAU MVP, ĐÃ CHỐT NGUYÊN TẮC\]:** mã giao dịch, hợp tác, số tiền, trạng thái, đối tác thanh toán, mã tham chiếu đối tác và dấu vết đối soát; không lưu dữ liệu thẻ nhạy cảm.

## 8.3 Ràng buộc dữ liệu

- Mỗi Project Brief phải có chủ sở hữu là Business hợp lệ.
- Hồ sơ ứng viên và Invitation phải tham chiếu dự án đã công bố và tài khoản hợp lệ; mỗi cặp dự án–Freelancer chỉ có một hồ sơ ứng viên.
- CV của ứng viên chỉ Business sở hữu dự án liên quan được xem để duyệt hồ sơ; tin nhắn chỉ hai bên được cấp quyền xem.
- Mỗi dự án chỉ có tối đa một bản tóm tắt thỏa thuận đang có hiệu lực tại một thời điểm; hệ thống phải ngăn hai thỏa thuận cùng được xác nhận thành công cho cùng một dự án, kể cả khi thao tác xảy ra đồng thời.
- Quy định thời gian lưu trữ và xóa dữ liệu cá nhân: **\[CẦN XÁC NHẬN\]**.

# 9\. Các yêu cầu cần xác nhận

Các mục TBD là quyết định còn mở; chúng không được xem là yêu cầu đã chốt. Trước khi phát triển MVP, nhóm cần ưu tiên chốt các TBD ảnh hưởng trực tiếp đến bảo mật, quyền truy cập, trạng thái ngoại lệ, giới hạn tệp và email notification nếu bật.

| **Mã** | **Nội dung chưa xác định**                                                                                                 | **Ảnh hưởng**                         |
| ------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| TBD-01 | Giới hạn định dạng/dung lượng CV và portfolio; thời gian lưu trữ/xóa dữ liệu cá nhân là bao lâu?                           | Bảo mật, vận hành và tuân thủ dữ liệu |
| ---    | ---                                                                                                                        | ---                                   |
| TBD-02 | Tiêu chí, trọng số và cách kiểm chứng chất lượng matching MVP là gì; có dùng AI thật ở giai đoạn sau không?                | Đầu ra và độ minh bạch gợi ý          |
| ---    | ---                                                                                                                        | ---                                   |
| TBD-03 | Quy trình xác minh hồ sơ, CV và portfolio sau MVP như thế nào?                                                             | Độ tin cậy thông tin                  |
| ---    | ---                                                                                                                        | ---                                   |
| TBD-04 | Khi mở rộng Workspace, tiêu chí hoàn tất dự án và điều kiện mở quyền đánh giá là gì?                                       | Workspace và Reputation               |
| ---    | ---                                                                                                                        | ---                                   |
| TBD-05 | Sau MVP có milestone, giới hạn chỉnh sửa và phiên bản bàn giao không; ai phê duyệt tiêu chí nghiệm thu?                    | Quy trình hợp tác                     |
| ---    | ---                                                                                                                        | ---                                   |
| TBD-06 | Khi triển khai thanh toán sau MVP, chọn đối tác nào; luồng trả tiền, phí, hoàn tiền, khiếu nại và trách nhiệm thuế ra sao? | Tích hợp, pháp lý và thanh toán       |
| ---    | ---                                                                                                                        | ---                                   |
| TBD-07 | Đánh giá sau MVP là một chiều hay hai chiều, tiêu chí nào và lúc nào được công khai?                                       | Reputation và quyền riêng tư          |
| ---    | ---                                                                                                                        | ---                                   |
| TBD-08 | Quy tắc rút ứng tuyển, hủy lời mời, từ chối ứng viên và hủy dự án cần được chốt chi tiết ra sao?                           | Các trạng thái ngoại lệ MVP           |
| ---    | ---                                                                                                                        | ---                                   |
| TBD-09 | Cần chốt danh sách sự kiện gửi email, mẫu nội dung, dịch vụ gửi email và chính sách thử lại như thế nào?                   | Email notification tùy chọn trong MVP |
| TBD-10 | Thời hạn review deliverable; có áp dụng nhắc hạn/auto-accept hay không?                                                    | Nghiệm thu và giải ngân               |
| TBD-11 | Số vòng chỉnh sửa bao gồm; định nghĩa revision hợp lệ và Change Request.                                                   | Phạm vi, chi phí và tranh chấp        |
| TBD-12 | Chính sách hủy, hoàn tiền toàn phần/một phần và phân bổ tiền khi dừng giữa milestone.                                      | Thanh toán và khiếu nại               |
| TBD-13 | Mức phí FREVO cuối cùng, bên chịu phí đối tác, currency và phương thức thanh toán.                                         | Mô hình kinh doanh và đối soát        |
| TBD-14 | Giới hạn video portfolio cuối cùng theo định dạng, dung lượng, thời lượng và chi phí media.                                | Portfolio và chi phí vận hành         |

## Phụ lục – Tham chiếu pháp lý cho quyết định thanh toán

- Nghị định 117/2025/NĐ-CP ngày 09/06/2025 về quản lý thuế đối với hoạt động kinh doanh trên nền tảng thương mại điện tử, nền tảng số; cần rà soát quy định sửa đổi và quy định áp dụng tại thời điểm ra mắt.
- Nguồn tham khảo: <https://vbpl.vn/TW/Pages/ivbpq-toanvan.aspx?ItemID=178299>
- Việc xác định thu nhập của Freelancer thuộc diện thu nhập kinh doanh hay tiền công/tiền thù lao, và ai có nghĩa vụ khấu trừ/nộp thay, cần thẩm định theo hợp đồng và cách vận hành thực tế.

# 10\. Quy tắc nghiệp vụ chi tiết cho Workspace, Milestone và thanh toán mô phỏng

Phần này ghi nhận quy tắc mục tiêu cho giai đoạn mở rộng và phạm vi mô phỏng phục vụ prototype/demo. Không được hiểu các trạng thái mô phỏng là dịch vụ ký quỹ, cam kết giữ tiền hoặc thanh toán tiền thật. Trước khi vận hành thật, FREVO phải chọn đối tác phù hợp, thẩm định pháp lý, điều khoản người dùng, phí, thuế và quy trình đối soát.

## 10.1 Portfolio hình ảnh và video trong MVP

Freelancer cá nhân và Team có thể thêm mục portfolio dạng ảnh, video hoặc liên kết ngoài; từng mục có tiêu đề, mô tả ngắn, vai trò/đóng góp, công cụ (nếu có) và quyền hiển thị.

Video có thể được tải lên dịch vụ lưu trữ/media như Cloudinary và phát bằng player nhúng; không lưu tệp video nhị phân trực tiếp trong cơ sở dữ liệu. Cơ sở dữ liệu lưu metadata, URL/asset ID, chủ sở hữu, loại media và trạng thái xử lý.

Giới hạn khởi điểm đề xuất cho demo: video tối đa 100 MB và 2 phút mỗi video; chỉ cho phép định dạng được cấu hình (ví dụ MP4/H.264). Đây là giới hạn sản phẩm đề xuất, phải kiểm tra theo gói dịch vụ, chi phí, hiệu năng và nhu cầu thực tế trước khi chốt.

Hệ thống phải kiểm tra loại tệp, dung lượng, quyền sở hữu và trạng thái upload; hiển thị lỗi rõ ràng khi upload thất bại. Không coi portfolio tự khai là đã xác minh nếu chưa có quy trình xác minh.

## 10.2 Một thỏa thuận, nhiều milestone

Một dự án/hợp tác có một Project Agreement (bản thỏa thuận dự án) chứa phạm vi tổng thể và danh sách milestone đã được hai bên xác nhận. Không tạo hợp đồng riêng cho từng milestone theo mặc định.

Mỗi milestone phải có tối thiểu: tên, mô tả công việc, deliverables, định dạng/kênh bàn giao, tiêu chí nghiệm thu đo được, hạn bàn giao, số tiền, số lần chỉnh sửa bao gồm và trạng thái.

Mọi thay đổi phạm vi, giá, hạn, deliverables, tiêu chí nghiệm thu hoặc số milestone phải được lập thành Change Request và được cả Business lẫn Freelancer/đại diện Team xác nhận trước khi áp dụng. Lưu phiên bản và lịch sử ai thay đổi, thời điểm, nội dung cũ/mới.

Mỗi dự án chỉ có một bên thực hiện được chọn: cá nhân hoặc Team. Với Team, tài khoản đại diện chịu trách nhiệm thao tác và giao tiếp trên FREVO; phân chia đóng góp giữa thành viên cần được nêu rõ nếu có liên quan đến deliverables.

## 10.3 Funding theo milestone và giải ngân

Mặc định Business không phải nạp toàn bộ ngân sách dự án ngay từ đầu. Business chỉ funding milestone hiện tại/kế tiếp trước khi Freelancer bắt đầu thực hiện milestone đó. Có thể yêu cầu funding toàn bộ cho dự án nhỏ nếu hai bên chọn rõ trong thỏa thuận.

Trong môi trường demo, nút "Fund milestone" chỉ chuyển trạng thái mô phỏng từ Pending Funding sang Funded (Simulated). UI và dữ liệu phải ghi rõ "Demo/Simulated"; không hiển thị hoặc diễn đạt như thể FREVO/đối tác đã nhận tiền thật.

Luồng mục tiêu khi tích hợp đối tác thật: Pending Funding → Funded/Confirmed by Provider → In Progress → Submitted → Under Review → Accepted → Release Pending/Released. Chỉ xác nhận Funded khi kết quả từ đối tác được xác thực và đối soát đúng giao dịch, dự án, milestone, số tiền và currency.

Sau khi Business chấp nhận deliverable theo tiêu chí đã thỏa thuận, hệ thống yêu cầu đối tác thực hiện giải ngân theo cơ chế đã được pháp lý/đối tác phê duyệt. Không tự tuyên bố đây là escrow nếu sản phẩm/đối tác không cung cấp dịch vụ ký quỹ hợp pháp.

Phí FREVO 5% trên giá trị milestone được nghiệm thu là phương án kinh doanh đề xuất để mô hình hóa trong demo, chưa phải phí đã chốt cuối cùng. Ví dụ milestone 2.000.000 VND, phí minh họa 100.000 VND và phần Freelancer nhận 1.900.000 VND trước phí đối tác/thuế nếu có. Phải hiển thị rõ ai chịu phí và cách tính trước khi xác nhận thỏa thuận.

## 10.4 Nộp bàn giao, nghiệm thu và chỉnh sửa

Freelancer nộp deliverable bằng upload tệp hoặc liên kết; hệ thống ghi nhận người nộp, thời điểm, phiên bản, ghi chú và bằng chứng bàn giao. Khi nộp, milestone chuyển sang Submitted/Under Review và bắt đầu thời hạn review.

Business có ba hành động: Accept; Request Revision; Open Dispute. Request Revision phải nêu tiêu chí đã thống nhất chưa đạt, bằng chứng/liên kết liên quan và phần cần sửa. Yêu cầu mới ngoài phạm vi không được ép thành revision; phải dùng Change Request.

Số lần chỉnh sửa bao gồm phải được định nghĩa ở từng milestone. Đề xuất mặc định cho prototype: 2 vòng chỉnh sửa nằm trong phạm vi; thay đổi lớn hoặc vòng bổ sung cần hai bên đồng ý về chi phí/hạn. Đây là giá trị khởi điểm cần nhóm phê duyệt, không phải quy tắc pháp lý mặc định.

Đề xuất thời hạn review: 5 ngày làm việc kể từ khi hệ thống ghi nhận bàn giao. Nếu Business không phản hồi, hệ thống gửi nhắc trước hạn và khi hết hạn chuyển sang trạng thái Review Overdue; không tự động giải ngân trong MVP/demo. Auto-accept/auto-release chỉ được bật sau khi hai bên chấp thuận rõ trong điều khoản và đối tác hỗ trợ.

Nếu Business cho rằng deliverable không đạt, phản hồi phải đối chiếu tiêu chí nghiệm thu đã thống nhất; không thể từ chối chỉ vì đổi ý hoặc yêu cầu mới. Freelancer được xem lý do, gửi phiên bản sửa và lịch sử bàn giao.

## 10.5 Tranh chấp, hủy và hoàn tiền

Khi một bên mở tranh chấp hợp lệ, chỉ milestone và số tiền liên quan bị đặt ở trạng thái Disputed/Hold; các milestone khác không tự động bị khóa nếu không có lý do phụ thuộc được ghi nhận.

Trong demo, trạng thái Hold/Refund/Release chỉ là mô phỏng nghiệp vụ. Hệ thống ghi nhận lý do, bằng chứng, người mở, thời điểm và quyết định xử lý; không thực hiện chuyển tiền thật.

Nguyên tắc đề xuất: nếu deliverable không đạt tiêu chí đã thỏa thuận, ưu tiên revision trong giới hạn; nếu không thể khắc phục, các bên thương lượng phần công việc đã hoàn thành và khoản hoàn tương ứng. Nếu yêu cầu là thay đổi phạm vi, xử lý bằng Change Request chứ không mặc định là lỗi Freelancer.

Quy tắc hoàn tiền cuối cùng, phân bổ tiền khi chấm dứt giữa milestone, thời hạn phản hồi tranh chấp và cơ chế phân xử độc lập vẫn là TBD cần chốt trước khi tích hợp thanh toán thật. Không tự động hoàn toàn bộ hay giải ngân khi chưa có kết quả xử lý được ghi nhận.

## 10.6 Trạng thái tối thiểu và kiểm soát

Milestone: Draft → Awaiting Funding → Funded (Simulated/Provider Confirmed) → In Progress → Submitted → Under Review → (Revision Requested → In Progress) hoặc Accepted → Release Pending → Released; nhánh ngoại lệ: Disputed, Cancelled, Refunded/Partially Refunded.

Không cho bắt đầu milestone nếu chưa Funded theo mô hình được chọn; không cho release nếu chưa Accepted hoặc chưa có kết quả giải quyết tranh chấp hợp lệ; không cho sửa tiêu chí sau khi bắt đầu mà không có Change Request được hai bên chấp thuận.

Các callback thanh toán thật phải được xác thực, xử lý idempotent và đối soát; callback lặp không tạo giao dịch trùng. Lưu transaction ID/reference và audit log, tuyệt đối không lưu dữ liệu thẻ nhạy cảm.

Quyền truy cập deliverables, tin nhắn và bằng chứng giới hạn theo các bên tham gia dự án; mọi hành động quan trọng ghi lại actor, timestamp, trạng thái trước/sau và lý do.

## 10.7 Quyết định cần chốt trước khi phát triển

Chốt thời hạn review: đề xuất 5 ngày làm việc; có hay không auto-accept và chỉ áp dụng khi có thông báo/đồng thuận rõ.

Chốt số vòng chỉnh sửa bao gồm: đề xuất 2 vòng mỗi milestone; định nghĩa revision hợp lệ và Change Request.

Chốt chính sách hủy/hoàn tiền và cách phân bổ khi chỉ hoàn thành một phần milestone.

Chốt mức phí FREVO (5% hiện chỉ là giả định mô hình), bên chịu phí đối tác, thuế và currency được hỗ trợ.

Chốt nhà cung cấp payment/escrow, khả năng phục vụ Việt Nam, tài khoản sandbox, cơ chế funding/release/refund/dispute và yêu cầu pháp lý trước khi triển khai tiền thật.

Chốt giới hạn video cuối cùng theo nhu cầu người dùng và gói Cloudinary; 100 MB/2 phút chỉ là giá trị khởi điểm đề xuất.

Chốt sự kiện email tùy chọn, định dạng/dung lượng file portfolio, lưu trữ/xóa dữ liệu và quy trình xử lý báo cáo nội dung.

# 11\. Bổ sung và chuẩn hóa yêu cầu A–I đã thảo luận

Mục này làm rõ các quy tắc còn thiếu hoặc chưa đủ cụ thể ở các mục trước. Khi có khác biệt, yêu cầu đã được nhóm xác nhận tại mục 2.5 và các Business Rules đã chốt được ưu tiên; nội dung ghi "đề xuất/TBD" phải được nhóm phê duyệt trước khi xem là tiêu chí nghiệm thu cuối cùng.

## 11.1 A. Matching và tiêu chí chọn ứng viên

Đầu vào matching MVP gồm: kỹ năng bắt buộc và kỹ năng liên quan; lĩnh vực/loại công việc; ngân sách hoặc khoảng phí; thời gian sẵn sàng và deadline; loại đơn vị thực hiện mà Business ưu tiên (Cá nhân/Team/Cả hai); và bằng chứng năng lực có trong hồ sơ/portfolio/proposal. Không phải trường nào cũng bắt buộc; Project Brief phải phân biệt điều kiện bắt buộc với tiêu chí ưu tiên.

Điều kiện lọc cứng chỉ áp dụng cho điều kiện Business đánh dấu rõ là bắt buộc và có dữ liệu đủ tin cậy. Các tiêu chí ưu tiên dùng để xếp hạng, không tự động loại ứng viên. Lựa chọn Cá nhân/Team chỉ là ưu tiên xếp hạng, không chặn loại còn lại khỏi quyền ứng tuyển.

MVP dùng quy tắc lọc/xếp hạng có thể giải thích; không quảng bá là AI nếu chưa dùng mô hình AI thực. Mỗi gợi ý hiển thị các yếu tố phù hợp và thiếu hụt có căn cứ từ dữ liệu hồ sơ/brief. Không bịa điểm số, chứng chỉ, xác minh hoặc năng lực không có bằng chứng.

Đối với Team, matching đánh giá hồ sơ và năng lực của Team như một đơn vị; thành tích Team không tự động được gán cho từng thành viên. Với cá nhân thuộc Team được gợi ý riêng, chỉ dùng bằng chứng năng lực của cá nhân; quan hệ Team chỉ hiển thị khi có dữ liệu liên kết.

Không tự động tuyển, từ chối hoặc gửi lời mời chỉ dựa trên thứ hạng. Business là người quyết định. Trước khi nghiệm thu, nhóm phải chốt trọng số/ưu tiên cụ thể, xử lý trường dữ liệu thiếu và bộ test mẫu để kiểm tra thứ tự gợi ý; nếu chưa chốt trọng số, không xem thứ hạng là cam kết chất lượng tuyệt đối.

## 11.2 B. Giới hạn tệp, video và lưu trữ

MVP portfolio hỗ trợ ảnh, video và liên kết ngoài. Mỗi mục lưu metadata tối thiểu: chủ sở hữu, tiêu đề, mô tả, loại media, URL/asset ID, kích thước, định dạng, ngày tạo/cập nhật và trạng thái upload/xử lý. Tệp nhị phân không được lưu trực tiếp trong cơ sở dữ liệu quan hệ.

Video có thể dùng Cloudinary hoặc dịch vụ media tương đương. Giá trị khởi điểm cho prototype là tối đa 100 MB và 2 phút/video; đây là giới hạn sản phẩm đề xuất, không phải cam kết mặc định của mọi gói dịch vụ. Nhóm phải xác minh giới hạn gói, quota, băng thông, chi phí chuyển đổi và điều kiện thương mại trước khi triển khai.

Định dạng cho phép được cấu hình theo từng loại nội dung; prototype có thể bắt đầu với MP4/H.264 cho video và JPEG/PNG/WebP cho ảnh. Hệ thống kiểm tra MIME type thực tế, phần mở rộng, kích thước, quyền sở hữu và kết quả upload; không tin cậy phần mở rộng do trình duyệt gửi lên.

CV/tài liệu ứng tuyển chỉ được truy cập bởi Business sở hữu dự án liên quan và người dùng có quyền hợp lệ. Portfolio công khai chỉ hiển thị theo cài đặt quyền riêng tư. Không đưa API secret của nhà cung cấp media ra client; upload trực tiếp phải dùng chữ ký/token có thời hạn nếu dịch vụ yêu cầu.

Chính sách lưu trữ/xóa tài khoản và tệp, thời hạn lưu bản bàn giao, xử lý tệp độc hại, quyền sử dụng nội dung và quy trình xóa dữ liệu cá nhân là TBD phải được chốt. Khi xóa mục portfolio, cần quy định xóa vật lý hay xóa mềm và cách xử lý bản sao/cache.

## 11.3 C. Email Notification

Thông báo trong ứng dụng là kênh chính và là yêu cầu MVP. Email là kênh tùy chọn trong MVP, bật theo cấu hình; email không thay thế trạng thái chuẩn trong hệ thống và lỗi gửi email không được làm thất bại thao tác nghiệp vụ chính.

Các sự kiện in-app tối thiểu: có ứng tuyển mới; nhận lời mời; lời mời được chấp nhận/từ chối/hết hạn; hồ sơ được duyệt/từ chối; có tin nhắn mới; có đề xuất thỏa thuận hoặc phiên bản mới cần phản hồi; thỏa thuận được xác nhận/từ chối/hết hạn; dự án đóng tuyển/hủy. Sự kiện email phải được cấu hình riêng và nhóm có thể chọn chỉ gửi cho sự kiện quan trọng.

Mỗi notification có người nhận, loại sự kiện, tham chiếu dự án/hồ sơ, thời điểm tạo, trạng thái đã đọc/chưa đọc và liên kết đến màn hình phù hợp. Không đưa nội dung CV, thông tin riêng tư hoặc nội dung nhạy cảm vào email không cần thiết.

Nếu email bật, hệ thống ghi nhận lỗi gửi, hỗ trợ retry có giới hạn và tránh gửi trùng khi xử lý lại sự kiện. Danh sách email cuối cùng, mẫu nội dung, nhà cung cấp, giới hạn retry và cấu hình môi trường là TBD trước khi nghiệm thu email.

## 11.4 D. Rút ứng tuyển, hủy lời mời và hủy dự án

Rút ứng tuyển: Freelancer/đại diện Team có thể rút hồ sơ khi dự án còn Đang tuyển và hồ sơ chưa được chọn; hệ thống ghi lý do tùy chọn, thời điểm và chuyển hồ sơ sang Đã rút. Không cho rút để xóa lịch sử; Business vẫn thấy hồ sơ ở trạng thái đã rút trong danh sách lịch sử.

Hủy lời mời: Business có thể hủy lời mời đang Chờ phản hồi khi dự án còn Đang tuyển. Lời mời đã chấp nhận không thể xóa hồ sơ ứng viên; từ thời điểm đó, Business xử lý hồ sơ theo quy trình xem xét. Lời mời hết hạn sau 7 ngày theo quy tắc hiện tại; lời mời đã hủy/hết hạn không thể được chấp nhận, nhưng có thể gửi lời mời mới nếu dự án còn mở.

Từ chối ứng viên: chỉ Business sở hữu dự án được từ chối hồ sơ. Sau khi chuyển sang Không được chọn, không thể tiếp tục chat hoặc xác nhận thỏa thuận từ hồ sơ đó; lịch sử vẫn được lưu. Nếu Business duyệt nhầm, cần thao tác quản trị/khôi phục có audit log hoặc tạo lại quy trình phù hợp, không âm thầm sửa trạng thái.

Hủy dự án: chỉ Business sở hữu dự án được hủy khi dự án chưa có thỏa thuận được hai bên xác nhận. Hệ thống yêu cầu xác nhận và lý do; chặn lời mời/ứng tuyển mới, vô hiệu hóa lời mời và đề xuất đang chờ, thông báo cho ứng viên liên quan và lưu lịch sử. Sau khi thỏa thuận đã xác nhận, không dùng thao tác hủy tuyển dụng để xóa nghĩa vụ đã thống nhất; việc chấm dứt hợp tác cần quy trình riêng và chính sách đã thỏa thuận.

Các hành động hủy không xóa bản ghi, tin nhắn hoặc audit log. Mọi thao tác phải kiểm tra quyền ở phía máy chủ và xử lý đồng thời để không thể xác nhận thỏa thuận trong khi dự án vừa bị hủy/đóng.

## 11.5 E. Đối tác thanh toán, funding, hoàn tiền và tranh chấp

Thanh toán tiền thật nằm ngoài MVP. Prototype/demo chỉ mô phỏng trạng thái và phải hiển thị rõ "Simulated/Demo"; không tuyên bố FREVO đã nhận, giữ hoặc chuyển tiền thật. Không lưu thông tin thẻ nhạy cảm.

Định hướng sau MVP: dùng đối tác thứ ba phù hợp pháp lý; không tự nhận là dịch vụ escrow nếu đối tác và mô hình hợp đồng không cung cấp dịch vụ ký quỹ hợp pháp. Trước tích hợp phải kiểm tra khả năng phục vụ Việt Nam, KYC/KYB, currency, funding theo milestone, release, refund, dispute, webhook, phí và quy trình đối soát.

Một Project Agreement chứa nhiều milestone. Business mặc định funding milestone hiện tại/kế tiếp trước khi công việc của milestone đó bắt đầu; không bắt buộc funding toàn bộ dự án ngay từ đầu. Chỉ cho chuyển sang In Progress khi trạng thái funding được xác nhận theo môi trường đang chạy: Simulated trong demo hoặc Provider Confirmed sau khi xác thực phản hồi đối tác.

Giải ngân chỉ được yêu cầu sau khi Business chấp nhận deliverable theo tiêu chí đã thống nhất hoặc có quyết định tranh chấp hợp lệ theo chính sách được phê duyệt. Một milestone đang tranh chấp chỉ giữ khoản tiền liên quan; các milestone khác không tự động bị khóa trừ khi có phụ thuộc được ghi nhận.

Khi deliverable không đạt tiêu chí: ưu tiên yêu cầu chỉnh sửa trong số vòng đã thống nhất. Nếu yêu cầu mới nằm ngoài brief/agreement, dùng Change Request thay vì coi là lỗi bàn giao. Nếu không thể khắc phục, xử lý theo chính sách hoàn một phần/toàn phần và phần công việc đã hoàn thành; không tự động hoàn toàn bộ hay giải ngân khi tranh chấp chưa có kết quả.

Phí FREVO 5% là giả định minh họa, chưa phải quyết định cuối cùng; UI phải thể hiện rõ cách tính, bên chịu phí, phí đối tác và khoản Freelancer dự kiến nhận trước khi hai bên xác nhận. Thuế, hóa đơn, khấu trừ và nghĩa vụ pháp lý phải được thẩm định riêng.

Webhook/callback thật phải xác thực chữ ký, đối soát transaction ID, project ID, milestone ID, amount và currency; xử lý idempotent, ghi audit log và không tạo giao dịch trùng. Các trạng thái simulated và provider-confirmed phải phân biệt bằng dữ liệu, giao diện và log.

Chính sách review, auto-accept, refund, cancellation sau khi đã funding, thời hạn tranh chấp, bằng chứng được chấp nhận, quyền ra quyết định và quy trình kháng nghị phải được phê duyệt trước khi triển khai tiền thật.

## 11.6 F. Quy tắc chat

Chat được gắn với một dự án và một hồ sơ ứng viên cụ thể. Chat chỉ mở sau khi Business sở hữu dự án duyệt hồ sơ ứng viên; việc gửi lời mời hoặc Freelancer chấp nhận lời mời không tự mở chat.

Chỉ Business sở hữu dự án và tài khoản Freelancer đại diện của hồ sơ được đọc/gửi tin nhắn. Trong MVP, Team dùng tài khoản đại diện; thành viên Team khác không được tự động truy cập chat nếu không có cơ chế phân quyền đã triển khai và được đặc tả.

Khi dự án đóng tuyển, các hồ sơ chưa được chọn không được tiếp tục trao đổi qua chat của quy trình tuyển. Lịch sử chat đã phát sinh được lưu và chỉ các bên có quyền truy cập xem được; hủy dự án hoặc rút ứng tuyển không xóa lịch sử.

MVP cần hỗ trợ gửi tin nhắn văn bản, hiển thị người gửi/thời điểm và trạng thái tải/lỗi cơ bản. Tệp đính kèm chat, trạng thái đã đọc, real-time nâng cao và kiểm duyệt nội dung là ngoài phạm vi nếu chưa có FR cụ thể. Chat không tự thay đổi nội dung Project Agreement; thay đổi phạm vi phải được xác nhận qua Change Request/phiên bản thỏa thuận.

## 11.7 G. Agreement và Contract

Project Agreement trong MVP là bản tóm tắt thỏa thuận điện tử được lưu trên FREVO, không mặc nhiên là hợp đồng điện tử có chữ ký số hay tư vấn pháp lý. Tài liệu phải phân biệt rõ "đã xác nhận thỏa thuận trên nền tảng" với "đã ký hợp đồng pháp lý riêng".

Một dự án chỉ có một Project Agreement đang có hiệu lực tại một thời điểm. Agreement ghi ít nhất: Business, Freelancer/Team đại diện, phạm vi, deliverables, ngân sách, deadline, loại đơn vị thực hiện, các điều kiện đã thống nhất, phiên bản, người xác nhận và thời điểm xác nhận.

Bản nháp/chưa được hai bên xác nhận có thể được sửa bởi bên tạo đề xuất. Sau khi một bên xác nhận, thay đổi nội dung phải tạo phiên bản mới hoặc Change Request và yêu cầu bên còn lại xác nhận lại; lưu lịch sử phiên bản, giá trị trước/sau, người thay đổi và thời điểm. Không ghi đè lịch sử đã xác nhận.

Đề xuất thỏa thuận hết hạn sau 3 ngày theo quy tắc hiện tại; lời mời hết hạn sau 7 ngày. Khi một bên từ chối hoặc đề xuất hết hạn, phiên bản đó không thể được chấp nhận; Business có thể gửi đề xuất mới nếu dự án còn hợp lệ.

Chỉ cho phép một đơn vị thực hiện được chọn cho mỗi dự án. Hệ thống phải dùng transaction/unique constraint hoặc cơ chế tương đương để ngăn hai thỏa thuận cùng được xác nhận thành công do thao tác đồng thời. Khi thỏa thuận có hiệu lực, dự án chuyển sang Đã đóng tuyển; điều đó không có nghĩa công việc đã hoàn thành hay đã thanh toán.

## 11.8 H. Các quy tắc trạng thái và quyền hủy liên quan

Dự án MVP: Bản nháp → Đang tuyển → Đã đóng tuyển; có thể chuyển Đã hủy khi đủ điều kiện. Không dùng Đã hoàn thành trong MVP vì MVP chưa quản lý nghiệm thu cuối cùng.

Hồ sơ ứng viên: Chờ Business xem xét → Được duyệt trao đổi → Đang trao đổi → Chờ Freelancer xác nhận thỏa thuận → Đã được chọn; nhánh khác gồm Không được chọn và Đã rút. Mọi chuyển trạng thái phải xác định actor được phép, điều kiện trước, thông báo phát sinh và khả năng đảo ngược.

Lời mời: Chờ phản hồi → Đã chấp nhận/Từ chối/Hết hạn/Đã hủy. Đề xuất thỏa thuận: Chờ phản hồi → Đã xác nhận/Từ chối/Hết hạn/Được thay thế. Các trạng thái kết thúc không được quay lại trạng thái chờ; cần tạo bản ghi/phiên bản mới nếu nghiệp vụ cho phép.

Các hành động thay đổi trạng thái quan trọng phải được kiểm tra quyền ở backend, ghi actor, timestamp, trạng thái trước/sau và lý do; giao diện ẩn nút không thay thế kiểm tra phân quyền phía máy chủ.

## 11.9 I. NFR và tiêu chí nghiệm thu kỹ thuật

Bảo mật/phân quyền: mọi API kiểm tra xác thực, vai trò và quyền sở hữu ở phía server. Bộ test phải bao gồm truy cập chéo Business, Freelancer, Team đại diện và người không tham gia dự án; kiểm tra cả đọc dữ liệu lẫn sửa trạng thái.

Hiệu năng: mục tiêu đề xuất là 95% API thông thường phản hồi ≤ 2 giây dưới tải thử nghiệm đã thống nhất, không tính thời gian của dịch vụ bên ngoài. Trước nghiệm thu phải ghi rõ môi trường, kích thước dữ liệu, số người dùng đồng thời, endpoint đo và cách tính percentile.

Khả năng sử dụng/tiếp cận: luồng cốt lõi phải chạy được trên một viewport desktop và một viewport mobile đã chọn; các trường nhập có nhãn, lỗi dễ hiểu, focus bàn phím nhìn thấy và thao tác chính có trạng thái loading/success/error. Hướng đến WCAG 2.2 AA nhưng cần xác định phạm vi kiểm tra thực tế.

Toàn vẹn dữ liệu: test tính duy nhất hồ sơ ứng viên theo project + tài khoản đại diện; không cho nhiều đơn vị thực hiện được chọn; không cho chat trước khi duyệt; không cho bắt đầu milestone chưa funded; không cho release trước Accepted/decision hợp lệ; xử lý hai request đồng thời và retry.

Độ tin cậy: lỗi upload/email/provider phải được ghi nhận, hiển thị trạng thái phù hợp và cho phép thử lại khi an toàn; lỗi dịch vụ ngoài không được làm mất brief, proposal, agreement hoặc trạng thái đã lưu. Với tích hợp thanh toán thật, cần idempotency, xác thực webhook, đối soát và audit log.

Riêng tư/lưu trữ: cần có chính sách thời hạn lưu dữ liệu, xóa tài khoản, xóa portfolio, retention của chat/agreement/evidence và quy trình xử lý yêu cầu xóa. Đây là điều kiện cần chốt trước khi mở dịch vụ công khai; không tự đặt thời hạn pháp lý khi chưa được rà soát.

Các ngưỡng số trong NFR là mục tiêu đề xuất cho nhóm xác nhận; khi nghiệm thu phải chuyển mỗi ngưỡng đã chốt thành test case có kết quả Pass/Fail, không chỉ mô tả chung.