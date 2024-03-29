# Campus-Information-Exchange-Platform

vue部分功能预览请可查看网址 https://frierennn.github.io/preview/

本校园信息交流网站开发初衷，旨在让校园内学生、职工等能够简单明了地查阅、参与到校内各式各样的信息交流中。因此本网站应当操作简单，布局一目了然。本网站应有友好的交互系统，有清晰的提示和指引，能够让学生和职工轻松地操作，从而给用户带来更贴心的体验。

第 1 章 项目实现
1.1	前台模块实现
1.1.1	游客无账号登录
1)	介绍
游客在的打开“乌托邦”网站时，会进入网站的欢迎页面。游客可无账号登
录体验本网站，无需注册登录直接点击“游客登录”按钮，就能浏览部分页面和体验部分功能。
2)	欢迎页面效果图展示
 
图5-1 欢迎页面效果图
1.1.2	用户登录
1)	介绍
用户登录是用户体验“乌托邦”网站所有页面和功能的前提。用户在欢迎页面点击“登录/注册”按钮，会来到登录页面。在登录页面下，用户输入正确的账号和密码，若跟数据库的数据匹配正确则登录成功。若用户没有网站账号，可以在本页面点击 “注册账号”或“游客无账号登录”按钮，前往注册或无账号登录；忘记密码也可点击重置链接，前往重置密码页面。
2)	用户登陆效果图展示
 
图5-2 用户登录效果图
3)	实现思路与主要代码
用户输入账号后，登录信息会先通过Element-UI框架Form 组件rules表单验证。若用户输入的账号为空或输入不是邮箱格式的账号时，登录信息将不需要进入数据库对比，网页会直接提示错误原因。通过上述方式可以减轻服务器的压力。
 
图5-3 用户登录前端核心代码
用户输入正确账号后，后端服务器会将登录信息与数据库数据对比。若无此账号，服务器反馈前端“不存在此账号”，若密码不正确则反馈“密码不正确”，若账号已被管理员禁止登录则反馈“已被禁止登录，请联系管理员…”，若登录无误则写入cookie用户相关信息以记录登录状态，并反馈“登录成功”跳转至主页。
 
图5-4 用户登录后端核心代码
1.1.3	游客注册
1)	介绍
用户没有本网站的账号，可通过注册操作注册账号。用户输入邮箱、密码后，点击‘点击获取’按钮获取注册用的验证码，服务器会给用户邮箱发送随机六位数的验证码邮件。用户需在一小时内填写正确验证码以完成注册。
2)	用户注册效果图展示
 
图5-5 用户注册效果图
3)	实现思路与主要代码
用户输入正确的邮箱后，点击“点击获取”按钮，后端服务器会先判断该邮箱是否已注册。用户邮箱未注册且一小时内未发送过验证码，后端服务器则使用nodemailer组件向用户邮箱发送随机六位数的验证码，并且向数据库emailcode表写入邮箱、验证码和发送时间。
 
图5-6 验证码后端核心代码
用户输入正确验证码后，点击“注册”按钮，后端服务器先检查该邮箱是否注册，后对比数据库邮箱、验证码及验证码过期时间，对比信息无误后写入数据库，用户即注册成功。其中用户密码还采用了MD5进行加密。
 
图5-7 用户注册后端核心代码
1.1.4	用户重置密码
1)	介绍
用户忘记密码时，可通过重置密码页面来重置密码。重置密码流程与注册相似，后端服务器通过发送验证码邮件来确认用户是否是本人，验证通过后会修改数据库中用户的密码信息。
2)	用户重置密码页面效果图展示
 
图5-8 用户重置密码页面效果图
1.1.5	广软新闻页面
1)	介绍
该页面为“乌托邦”网站的首页，由管理员编辑发布最新的校园新闻。用户点击新闻标题或图片等时，会跳转到文章详情页以查看新闻详情。
2)	广软新闻页面效果图展示
 
图5-9 广软新闻页面效果图
1.1.6	广软活动中心页面
1)	介绍
广软活动中心页面，也是由管理员编辑发布。用户可用鼠标悬浮到活动的标题上，以查看活动的简略介绍，也可点击跳转至文章查看详情。
2)	广软活动中心页面效果图展示
 
图5-10 广软活动中心面效果图
1.1.7	广软社区分享页面
1)	介绍
广软社区分享页面，该页面显示所有用户发表的文章。文章分为日常、二手、求助和交友四个分区，每个分区都有搜索功能，也可按照收藏、点赞等排序文章。用户可根据自身需求查找和查看文章信息。
2)	广软社区分享页面效果图展示
 
图5-11 广软社区分享页面效果图

1.1.8	文章详情页面
1)	介绍
用户在浏览“乌托邦”网站时，点击新闻、活动中心、社区分享网页上的文章图片或标题等，均会跳转到该文章的详情页面。在详情页面中，已登录的用户除了查看文章详情外，还可以进行点赞、收藏、举报等操作。
2)	文章详情页面效果图展示
 
图5-12 文章详情页面效果图
3)	实现思路与主要代码
文章详情页面会将文章的id发送至后端服务器，服务器根据id查找相应的分区里的文章信息返回，并增加该文章的阅读数。
 
图5-13 文章详情页面后端核心代码
已登录用户进入文章详情页面后，还会检查用户是否有对该文章点赞、收藏、举报。如果有，相应的按钮就会变成“取消”按钮，功能也会随之发生变化。
 
图5-14 文章举报检验模块后端核心代码
文章的点赞、收藏、举报功能大同小异，下文将展示实现举报功能的思路。举报功能按钮将按照服务器检查中返回的msg来改变按钮中的文字，用户点击按钮后会将举报人和其它相关信息发送至后台服务器，服务器再填写或删除数据库相关信息。
 
图5-15 文章举报模块后端核心代码
1.1.9	文章评论模块
1)	介绍
在文章详情页面，用户能够查看文章的最新和热门评论，对该文章评论，对评论进行点赞、回复，以及删除自己的评论或回复。
2)	文章评论页面效果图
 
图5-16 文章评论页面效果图
3)	实现思路与主要代码
评论模块的发表评论和回复评论功能大体一致。用户点击“发送”按钮后，前端会根据其提交表单的state属性进行区分评论和回复，若判断为回复则会在回复内容前面加入“@被回复人的昵称：”，判断为评论则不会添加前缀，随后发送至服务器写入数据库并重新获取评论区。
 
图5-17 文章发送评论前端核心代码
评论区的渲染评论和回复的实现思路是：后端服务器获取到文章评论的对象后，根据评论id属性获取评论相关的回复对象，然后将回复对象插入进对应的评论对象中。
 
图5-18 文章评论获取后端核心代码
1.1.10	发布分享文章模块
1)	介绍
已登录用户在社区分享页面，点击“发布文章”按钮将会进入发布文章页面。在发布文章页面下，用户可编辑发布文章，其中本项目采用的文本编辑器为Summernote富文本编辑器。
2)	发布文章页面效果图展示
 
图5-19 发布文章页面效果图
3)	实现思路与主要代码
用户填写完文章信息点击“发布文章”按钮后，前端检查内容是否为空，判断不为空则发送信息至后端服务器，由后端服务器填写进相应的数据库表中。
 
图5-20 发布文章页面后端核心代码
1.1.11	我的消息模块
1)	介绍
当已登录用户发布的文章或评论被其他用户回复评论点赞后，会在我的消息模块提醒通知用户，用户点击通知将会跳转至相应的位置。管理员给用户发送的系统通知也会在该页面通知。用户可根据自己需求保留或删除消息通知。
2)	我的消息页面效果图展示
 
图5-21 我的消息页面效果图
3)	实现思路与主要代码
本页面我的回复、文章评论、收到的赞和系统通知四个功能的实现相差无几。
前端发送请求后，后端服务器返回数据库相关数据。用户点击删除通知时，数据库相关通知信息则会被删除。
 
图5-22 我的消息页面后端核心代码
1.1.12	个人信息修改模块
1)	介绍
已登录的用户能够在个人中心页面里，对自己的个人信息修改。用户点击“重置密码”按钮，会跳转至前文的重置密码页面。个人中心页面还可以搜索其他用户，用户可在其他用户信息页面查看对方的相关信息、关注对方。
2)	个人信息修改页面效果图展示

 
图5-23 个人信息修改页面效果图
1.1.13	其他用户信息页面
1)	介绍
用户在浏览“乌托邦”网站时，点在任意页面点击其他用户头像或昵称时，会跳转至用户信息页面，在个人中心使用搜索其他用户功能也会跳转至该页面。在其他用户信息页面，用户可查看其他用户的相关消息和他发表的文章，还可以关注该用户和搜索其他用户。
2)	其他用户信息页面效果图展示

 
图5-24 其他用户信息页面效果图
1.1.14	我的文章管理模块
1)	介绍
已登录的用户在个人中心页面，可以对自己的文章查找、编辑和删除等。
2)	我的文章管理模块效果图展示
 
图5-25 我的文章页面效果图
 
图5-26 文章编辑页面效果图
3)	实现思路与主要代码
用户点击文字的“编辑”链接后，跳转至该文章的编辑页面。用户修改完文章后， 点击“保存发布”按钮，数据库将会更新用户的文章信息。
 
图5-27 文章编辑后端核心代码图
1.1.15	我的关注、收藏、粉丝模块
1)	介绍
已登录用户能够在个人中心页面查看、查找和管理自己关注的用户、收藏的文章和自己的粉丝。
2)	我的关注、收藏、粉丝效果图展示
 
图5-28 我的关注、收藏、粉丝效果图
1.2	后台模块的实现
1.2.1	后台登录模块
1)	介绍
管理员可在此页面登录后台管理系统，并且能够对“乌托邦”网站数据库添加、删除、修改和查询数据。
2)	后台登录页面的效果图展示
 
图5-29 后台登录页面效果图
1.2.2	新闻编辑管理模块
1)	介绍
在广软新闻编辑页面里，管理员能够发布新的新闻，也可以对已有新闻消息进行修改和删除。管理员如果想更新新闻文章的信息，单击文章右侧的编辑按钮，会跳转到前文中的文章编辑页。若新闻是轮播图中展示的新闻，管理员还可对新闻的轮播图进行替换。管理员还可以通过单击新闻右侧的删除按钮来删除新闻。
2)	新闻编辑管理页面的效果图展示
 
图5-30 新闻编辑管理页面效果图
3)	实现思路与主要代码
新闻发布、编辑和删除与上文前端模块中的文章发布、编辑和删除相似，以下将展示轮播图修改的实现。管理员点击“点击上传”按钮选中图片时，前端通过Element-UI框架中的Upload组件将新的图片提交给后端服务器，服务器用新的图片替换掉旧的便完成轮播图的修改。
 
图5-31 新闻轮播图修改后端核心代码
1.2.3	活动中心管理模块
1)	介绍
活动中心管理模块与新闻管理模块大同小异，也是发布新的活动和编辑、删除已有的活动。
2)	活动中心管理模块的效果图展示
 
图5-32 活动中心管理模块效果图
1.2.4	社区分享文章管理模块
1)	介绍
管理员通过社区分享文章管理模块，能够对用户发布的文章进行查找、编辑和删除等操作。
2)	社区分享文章管理模块的效果图展示
 
图5-33 社区分享文章管理模块的效果图
1.2.5	用户管理模块
1)	介绍
该模块下，管理员能够修改用户信息、限制用户的登录、给用户发送通知等。
2)	用户管理模块的效果图展示
 
图5-34 用户管理效果图
3)	实现思路与主要代码
管理员可以编辑用户的昵称、头像、介绍等信息，修改完成后点击“保存”，服务器将修改数据库相关信息。该模块下，管理员通过设置用户state状态以限制用户登录，还可以给用户发送通知，用户接受到的通知将在上文前端模块我的消息中显示。
 
图5-35 用户管理后端核心代码
 
 
图5-36 系统通知后端核心代码
1.2.6	举报管理模块
1)	介绍
用户举报文章后，管理员在后台我的消息中会接收到举报的消息。后续管理员可通过上述后端管理模块，对相关文章进行修改、删除，对用户发送处理信息通知。
2)	举报管理模块的效果图展示
 
图5-37 举报管理模块效果图
 

