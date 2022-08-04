drop table if exists TODO;
create table TODO(
    TODO_ID int PRIMARY KEY AUTO_INCREMENT,
    CONTENT VARCHAR(128),
    ISDONE  TINYINT(1) DEFAULT 0
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
insert into TODO(TODO_ID,CONTENT,ISDONE)
values(1,"web worker双线程实现",0);
insert into TODO(TODO_ID,CONTENT,ISDONE)
values(2,"vdom虚拟DOM树实现",0);
insert into TODO(TODO_ID,CONTENT,ISDONE)
values(3,"自定义组件渲染实现",0);
insert into TODO(TODO_ID,CONTENT,ISDONE)
values(4,"小程序框架实现",0);