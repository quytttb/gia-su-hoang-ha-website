'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import SectionHeading from '../components/shared/SectionHeading';
import { Schedule } from '../types';
import schedulesService from '../services/firestore/schedulesService';
import { format, parseISO } from 'date-fns';
import Chatbot from '../components/shared/Chatbot';
import PageHero from '../components/shared/PageHero';
import SkeletonLoading from '../components/shared/SkeletonLoading';
import ScheduleFilter from '../components/schedule/ScheduleFilter';
import ScheduleTableView from '../components/schedule/ScheduleTableView';
import ScheduleCalendarView from '../components/schedule/ScheduleCalendarView';
import PersonalSchedulePanel from '../components/schedule/PersonalSchedulePanel';
import { CalendarValue, ViewType } from '../components/schedule/scheduleTypes';
import { filterSchedules } from '../components/schedule/scheduleUtils';

const SchedulePage = () => {
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [personalSchedules, setPersonalSchedules] = useState<Schedule[]>([]);
  const [showPersonalSchedules, setShowPersonalSchedules] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [calendarValue, setCalendarValue] = useState<CalendarValue>(null);
  const [viewType, setViewType] = useState<ViewType>('table');
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendarEvents, setShowCalendarEvents] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterTutor, setFilterTutor] = useState('all');
  const [availableTutors, setAvailableTutors] = useState<string[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        const uniqueDates = await schedulesService.getAvailableDates();
        setAvailableDates(uniqueDates);

        if (uniqueDates.length > 0) {
          setSelectedDate(uniqueDates[0]);
          if (uniqueDates[0]) {
            setCalendarValue(parseISO(uniqueDates[0]));
          }
        }
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError('Không thể tải dữ liệu lịch học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    const fetchSchedulesByDate = async () => {
      if (!selectedDate) return;

      try {
        setLoading(true);
        setError(null);
        const filtered = await schedulesService.getByDate(selectedDate);
        setFilteredSchedules(filtered);
      } catch (err) {
        console.error('Error fetching schedules by date:', err);
        setError('Không thể tải dữ liệu lịch học cho ngày đã chọn. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedulesByDate();
  }, [selectedDate]);

  useEffect(() => {
    if (filteredSchedules.length > 0) {
      const tutors = Array.from(new Set(filteredSchedules.map(s => s.tutorName))).filter(Boolean);
      setAvailableTutors(tutors);
    }
  }, [filteredSchedules]);

  const displaySchedules = useMemo(
    () => filterSchedules(filteredSchedules, searchKeyword, filterTutor),
    [filteredSchedules, searchKeyword, filterTutor]
  );

  const hasActiveFilters = searchKeyword !== '' || filterTutor !== 'all';

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handleCalendarChange = useCallback((value: CalendarValue) => {
    setCalendarValue(value);
    if (value instanceof Date) {
      const formattedDate = format(value, 'yyyy-MM-dd');
      setSelectedDate(formattedDate);
    }
  }, []);

  const handlePhoneSubmit = useCallback(async (phone: string) => {
    try {
      setLoading(true);
      setError(null);
      const personalSchedulesData = await schedulesService.getByUserPhone(phone);
      setPersonalSchedules(personalSchedulesData);
      setShowPersonalSchedules(true);
      setPhoneSubmitted(true);
    } catch (err) {
      console.error('Error fetching personal schedules:', err);
      setError('Không thể tải dữ liệu lịch học cá nhân. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPersonalSchedules = useCallback(() => {
    setShowPersonalSchedules(false);
    setPersonalSchedules([]);
    setPhoneSubmitted(false);
  }, []);

  const toggleView = useCallback((type: ViewType) => {
    setViewType(type);
  }, []);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + (direction === 'prev' ? -1 : 1));
      return newMonth;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchKeyword('');
    setFilterTutor('all');
  }, []);

  const handleActiveStartDateChange = useCallback((date: Date) => {
    setCurrentMonth(date);
  }, []);

  const toggleCalendarEvents = useCallback(() => {
    setShowCalendarEvents(prev => !prev);
  }, []);

  if (loading && !phoneSubmitted) {
    return (
      <Layout>
        <section className="bg-gray-100 dark:bg-gray-900 py-16">
          <div className="container-custom text-center">
            <SkeletonLoading type="text" count={2} className="mx-auto" />
          </div>
        </section>

        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <SkeletonLoading type="text" count={1} className="w-1/3" />
              </div>
              <div className="mb-8 flex justify-between">
                {[...Array(3)].map((_, i) => (
                  <SkeletonLoading key={i} type="button" width="100px" />
                ))}
              </div>
              <div className="mb-8">
                <SkeletonLoading type="table-row" count={5} />
              </div>
            </div>
            <div>
              <div className="mb-6">
                <SkeletonLoading type="text" count={1} />
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <SkeletonLoading type="text" count={3} />
                <div className="mt-4">
                  <SkeletonLoading type="button" width="100%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        id="schedule-hero-heading"
        title="Lịch Học"
        subtitle="Xem lịch học các lớp và tra cứu lịch cá nhân"
      />

      <div className="container-custom py-12">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <SectionHeading title="Lịch học theo ngày" centered={false} />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => toggleView('table')}
                  className={`px-4 py-2 rounded ${viewType === 'table' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Dạng bảng
                </button>
                <button
                  type="button"
                  onClick={() => toggleView('calendar')}
                  className={`px-4 py-2 rounded ${viewType === 'calendar' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Lịch
                </button>
              </div>
            </div>

            <ScheduleFilter
              searchKeyword={searchKeyword}
              filterTutor={filterTutor}
              availableTutors={availableTutors}
              onSearchChange={setSearchKeyword}
              onTutorChange={setFilterTutor}
              onClearFilters={clearFilters}
            />

            {viewType === 'table' ? (
              <ScheduleTableView
                availableDates={availableDates}
                selectedDate={selectedDate}
                schedules={displaySchedules}
                hasActiveFilters={hasActiveFilters}
                onDateChange={handleDateChange}
                onClearFilters={clearFilters}
              />
            ) : (
              <ScheduleCalendarView
                calendarValue={calendarValue}
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                availableDates={availableDates}
                displaySchedules={displaySchedules}
                tileSchedules={filteredSchedules}
                showCalendarEvents={showCalendarEvents}
                hasActiveFilters={hasActiveFilters}
                onCalendarChange={handleCalendarChange}
                onMonthChange={navigateMonth}
                onActiveStartDateChange={handleActiveStartDateChange}
                onToggleCalendarEvents={toggleCalendarEvents}
                onClearFilters={clearFilters}
              />
            )}
          </div>

          <PersonalSchedulePanel
            loading={loading}
            showPersonalSchedules={showPersonalSchedules}
            personalSchedules={personalSchedules}
            onPhoneSubmit={handlePhoneSubmit}
            onReset={resetPersonalSchedules}
          />
        </div>
      </div>
      <Chatbot />
    </Layout>
  );
};

export default SchedulePage;
