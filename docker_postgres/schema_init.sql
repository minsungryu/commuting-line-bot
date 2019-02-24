create table if not exists account
(
	id bigserial not null
		constraint account_pk
			primary key,
	user_id varchar(64) not null,
    attendance_time time default '09:30',
    leave_time time default '18:00',
	deleted boolean default false
);

create unique index account_id_uindex on account (id desc);
create unique index account_user_id_uindex on account (user_id);

comment on table account is '알람봇 사용자';
comment on column account.id is 'PK';
comment on column account.user_id is 'LINE user id';
comment on column account.attendance_time is '출근시간';
comment on column account.leave_time is '퇴근시간';
comment on column account.deleted is '삭제여부';

alter table account owner to line_alarm_bot;